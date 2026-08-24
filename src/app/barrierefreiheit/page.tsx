import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barrierefreiheit",
  description: "Informationen zur Barrierefreiheit der Website von Joscha Aaron Schmidt.",
  alternates: { canonical: "/barrierefreiheit" },
};

const checkedAt = "25. August 2026";

export default function Barrierefreiheit() {
  return (
    <main className="container py-20 sm:py-28">
      <article className="prose max-w-3xl">
        <h1>Barrierefreiheit</h1>
        <p><strong>Stand dieser Erklärung: {checkedAt}</strong></p>
        <p>
          Joscha Aaron Schmidt ist bemüht, diese Website für alle Menschen zugänglich und
          nutzbar zu gestalten. Die technische Umsetzung orientiert sich an den Grundsätzen
          der Barrierefreiheit sowie an den Anforderungen der Web Content Accessibility
          Guidelines (WCAG), insbesondere an der Wahrnehmbarkeit, Bedienbarkeit,
          Verständlichkeit und Robustheit digitaler Inhalte.
        </p>

        <h2>Geltungsbereich</h2>
        <p>
          Diese Erklärung gilt für die öffentlich erreichbaren Seiten unter{" "}
          <a href="https://www.joschaschmidt.com">www.joschaschmidt.com</a>, soweit deren
          Inhalte und Funktionen von Joscha Aaron Schmidt bereitgestellt und technisch
          beeinflusst werden können.
        </p>

        <h2>Stand der Barrierefreiheit</h2>
        <p>
          Die Website wurde technisch auf wesentliche Anforderungen der digitalen
          Barrierefreiheit ausgerichtet. Dazu gehören unter anderem eine semantische
          HTML-Struktur, die Bedienung mit Tastatur, sichtbare Fokuszustände, beschreibende
          Bezeichnungen für interaktive Elemente, responsive Darstellung, ausreichende
          Kontraste sowie die Berücksichtigung von <code>prefers-reduced-motion</code> für
          Nutzerinnen und Nutzer, die reduzierte Bewegung bevorzugen.
        </p>
        <p>
          Eine vollständige Prüfung sämtlicher Seiten und Inhalte mit allen relevanten
          assistiven Technologien wurde nicht durchgeführt. Daher wird an dieser Stelle
          keine uneingeschränkte Konformität mit einer bestimmten WCAG-Konformitätsstufe
          behauptet. Erkannte Barrieren werden im Rahmen der technischen Weiterentwicklung
          behoben.
        </p>

        <h2>Bekannte Einschränkungen</h2>
        <p>
          Einzelne Inhalte oder eingebundene Dienste Dritter können trotz der eigenen
          technischen Umsetzung nicht vollständig barrierefrei sein. Auf deren Gestaltung
          und technische Änderungen besteht nur begrenzter Einfluss. Sollten Inhalte oder
          Funktionen auf dieser Website für Sie nicht zugänglich sein, können Sie dies über
          die unten genannte Kontaktmöglichkeit melden.
        </p>

        <h2>Feedback und Kontakt</h2>
        <p>
          Wenn Sie auf eine Barriere stoßen oder Unterstützung beim Zugriff auf einen Inhalt
          benötigen, teilen Sie uns dies bitte mit. Eine konkrete Beschreibung der betroffenen
          Seite oder Funktion hilft bei der Prüfung und Behebung.
        </p>
        <p>E-Mail: <a href="mailto:joschaschmidt@mail.de">joschaschmidt@mail.de</a></p>

        <h2>Rechtsgrundlage</h2>
        <p>
          Soweit die gesetzlichen Voraussetzungen im Einzelfall erfüllt sind, werden die
          Anforderungen des Barrierefreiheitsstärkungsgesetzes (BFSG) und der dazugehörigen
          Barrierefreiheitsstärkungsverordnung (BFSGV) berücksichtigt. Für die konkrete
          Anwendbarkeit dieser Vorschriften sind insbesondere Art und Umfang der angebotenen
          Dienstleistungen sowie die gesetzlichen Ausnahmen maßgeblich.
        </p>
        <p>
          Diese Erklärung wird bei wesentlichen Änderungen der Website oder des erreichten
          Barrierefreiheitsstands überprüft und bei Bedarf aktualisiert.
        </p>
      </article>
    </main>
  );
}
