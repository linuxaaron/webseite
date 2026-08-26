import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_TIMEOUT_MS = 7000;
const DEFAULT_NEWSLETTER_LIST_ID = 4;
const DEFAULT_DOI_TEMPLATE_ID = 6;
const MAX_BODY_BYTES = 8 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;

const requestLog = new Map<string, number[]>();

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",", 1)[0]?.trim() || realIp?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    requestLog.set(key, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(key, recent);

  if (requestLog.size > 2000) {
    for (const [entryKey, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_WINDOW_MS)) requestLog.delete(entryKey);
    }
  }

  return false;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, message: "Die Anfrage ist zu groß." }, { status: 413 });
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { ok: false, message: "Zu viele Anfragen. Bitte versuche es in einigen Minuten erneut." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }

  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, message: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 },
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const configuredListId = process.env.BREVO_NEWSLETTER_LIST_ID;
    const configuredTemplateId = process.env.BREVO_DOI_TEMPLATE_ID;
    const listId = configuredListId ? Number(configuredListId) : DEFAULT_NEWSLETTER_LIST_ID;
    const templateId = configuredTemplateId ? Number(configuredTemplateId) : DEFAULT_DOI_TEMPLATE_ID;

    if (
      !apiKey ||
      !Number.isInteger(listId) ||
      listId <= 0 ||
      !Number.isInteger(templateId) ||
      templateId <= 0
    ) {
      console.error("Newsletter configuration is incomplete.", {
        hasApiKey: Boolean(apiKey),
        hasConfiguredListId: Boolean(configuredListId),
        hasValidListId: Number.isInteger(listId) && listId > 0,
        hasConfiguredTemplateId: Boolean(configuredTemplateId),
        hasValidTemplateId: Number.isInteger(templateId) && templateId > 0,
      });
      return NextResponse.json(
        { ok: false, message: "Die Newsletter-Anmeldung ist momentan noch nicht vollständig eingerichtet." },
        { status: 503 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email,
          includeListIds: [listId],
          redirectionUrl: "https://joschaschmidt.com/",
          templateId,
        }),
        cache: "no-store",
        signal: controller.signal,
      });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "AbortError";
      console.error("Brevo API request failed:", timedOut ? "timeout" : error);
      return NextResponse.json(
        {
          ok: false,
          message: timedOut
            ? "Brevo hat nicht rechtzeitig geantwortet. Bitte versuche es gleich noch einmal."
            : "Die Verbindung zu Brevo konnte nicht hergestellt werden. Bitte versuche es später erneut.",
        },
        { status: timedOut ? 504 : 502 },
      );
    } finally {
      clearTimeout(timeout);
    }

    const details = await response.text();

    if (response.ok) {
      return NextResponse.json({
        ok: true,
        message: "Fast geschafft: Bitte prüfe dein Postfach und bestätige deine Newsletter-Anmeldung.",
      });
    }

    console.error("Brevo newsletter error:", response.status, details);

    if (response.status === 400 && /already|exist/i.test(details)) {
      return NextResponse.json({
        ok: true,
        message: "Diese Adresse ist bereits bekannt. Falls die Anmeldung noch nicht bestätigt wurde, prüfe bitte dein Postfach.",
      });
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { ok: false, message: "Die Newsletter-Verbindung ist momentan nicht verfügbar." },
        { status: 502 },
      );
    }

    if (response.status === 404) {
      return NextResponse.json(
        { ok: false, message: "Die Newsletter-Konfiguration ist momentan nicht verfügbar." },
        { status: 502 },
      );
    }

    if (response.status === 429) {
      return NextResponse.json(
        { ok: false, message: "Zu viele Anfragen an den Newsletter-Dienst. Bitte versuche es gleich noch einmal." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Die Newsletter-Anmeldung konnte beim Versanddienst nicht verarbeitet werden." },
      { status: 502 },
    );
  } catch (error) {
    console.error("Newsletter request failed:", error);
    return NextResponse.json(
      { ok: false, message: "Die Newsletter-Anfrage konnte technisch nicht verarbeitet werden." },
      { status: 500 },
    );
  }
}
