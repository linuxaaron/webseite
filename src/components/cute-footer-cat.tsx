"use client";

import { useEffect, useRef } from "react";

const CAT_ART = "data:image/webp;base64,UklGRvJPAABXRUJQVlA4WAoAAAAQAAAAlAEA/gAAQUxQSMciAAABl6GgbRum7Q5/0h9BRKwDosq3QSYcRrZVNfe8x/MTb/ovOIBoGojo/wTo6Su7aqfeaw2/77HG54p2I/M1bd1F1r3Q74yk+Olfp73sZoSko6PjON4SevYv1v7FYnsXL/taJW1t3bFCuy3Z626DhvGC1inz6ZH5mi8ewHPjvxgjwaJ8RItSzzwZf+R74Xzsbtm2fhnnzOKcUEQnX5BAi14AOZdr3CtJGa3lbyckpcbQQ1IEgE1fk0DmPjIgAdomupqm20lANsNorUWCbSkmAKkDGKSLvW3bxkb3omtJl4T5NZjJfXxuXzMuposdCj6fzVVFFVVV+14bA3LbSJIkSf57XVdX7ew/IiaAmwEVY8ablSzjcguQZd7a3TreqdpqVvJ1nM9SHnaC/PIqH6v4ox2Y2vhQMfB5bbiilNSPmOwmyxunlvOsbnXGu8lP7k7fxP9vvZY6kUaoM09cAUPFdZtusd03AVQDQRy2KKhyZWojmwGxroIsnTBobDedlJGaqTaZsh0wacpk3j4QpFUu0/Jw8G3f1ranjbRt226Hipmri6GLq2tf/1V48jBNMd7MjE9kW5Zld09GxAT4tW1bta1NkmpfxszM9P4PYfqvmmSimTOz+39mE9ba+4Nz/ZgaERPg6dq2tZGkbduP85IhwsnFzNVM10/v2Q1DJjVTMWNWYkQYdR4Dyw6HIhqGETEBfBMMSSBiET+fk6Rzxp0lyw0nTBeNDcXvT/77/a/59iskqUSYOy3JlkTTNFG4pvg5oIkSAPItWIhASq4z5J9TSiBm6FR+QaH3gb1vP7aBYMSQFcAGb4Z/xf5+8zFOy3MzHxI8VCCMZx7f5K1d8o1X2GRnXr7zFQMf/76+c9TR0dPeZxx86xHYzO4x/LJ6J52dvPw+d3aA3zimLYUiJPGQWofHCmduvF13+a2j5au1tLzKJkgXj1geFXtJ9eM3nI1ZXRsB0tFyzN53bFR8OyzSm7Wz1SXsjkzrgd8curjQGh8gXd2h9D8oHlxwswPI6LaMrZB2OABcsPdOpfo1vWOEXZIVmoBQCAqk9yXsfp9J/YfUItf/WaFTyigDhMpBIDU97qmpNB7HKnGge4ed4vKoDITABWX/XVPfaR9JRGO1WBQjpnS7cmRPDIHm9s1E4i4lVhRliZ2bbfP66q7fbAavfbIisU2tHJHB6TVfWvtDGqsG0i7K0bjkvnMaX9v2NXgPqNaC+364o7EKGjChjcZjDrBz0xi+CEEBrIefekAaK4uhhGc840K6fwzb9hXYroP1wNxJY6XSwFEyNl5Gd7s3ojJfQRckbAPYzJQCOKe51AyZjskUsHuo+5egYTPMUlEC0rILQFmk0YSlHFTKkS/h7YJVMG+Ck/wUBUhz4zwwSmPG3JPBSvFVtFHM5+zAFslKSYprY8zBBH0ZFqVlsyMx581cSHTTJAuV5m+GvQhGgN28SJqh3RS21pgsqvBVNALMI3CblVRDJjBYWWbgJaZFX4VFSfE1G6N0Eh6Npe79kNm4iS/CchyjYCbWSdhUBmMjORdrvciNo8mo7GvwEgfmMTAL96R32V6v2UpM4KN199Pf7qj/dD0zDF1I1ovuSQdsz4CTnbQE6ny8bKi0VP6w/GV7HAiLxtAoYOfiGi9ZY9iwkRbUu+1Rmd2/djKePIajcSfzVVyLRizMUZsmQoqkXErsc8sNr7oPGa89HcldlS+j8TBSd1VSxjGF+/bI8EySdsotDM2NxCQ253w5ImdFoWCZuC8pmADJhKQ92F4LS5Fp48TYYV+GRSPxkZVgRtxXUkjSLDgzHa8sd5UIbJs0ZJWvkCZyCehFjyJCh0CIuNpS0nNM6NT36X4i3JPGJvkyHi/Ev0+kIKxbAEVZxoiupLmfBJBOpT2edfOYuceQdGEeTdPgLrToObGN9EbrBswNbf29CIm25msZaPG2hW/24qkGoAdFBImr7YUTMaEWNmRKWvMltQWNx1e12K8V9GWt3g6xyKpgKoDtc8pz34RLjPTahvn3bJJ0POq2JLXK5J2dj2MHd/MIhdb7dlGEThQWnUdsHtlEpO0yKzbN1Qkm7ZGK7AlSXpJZEn4KIUgte4kqm9FVlMwnkrH05iHbE8xwrRs5bavyrwVovkuyRpLsnptrKQk00mpMswj+SbdT2venm1K2sU42PxxkGEMJYOS3QmvSVEK+Yqud0SyGFIFtHszHpHyB5U1QM4XjCOqARtJFgWQ6hYMTdpLOcGEhHQ3QF8X4kpYoZHkQqkprd+1p2JE0jPlq2o8DIFqjlTqSvtLCYACE3r3j/zM1wsroFEmb6Sm0sfe/OTfn6+YVdzkqLaS0/t0uEPKcnChVdHNhGTWdJQtBkrL2lYeXUxink7KIsPbxR4Iq62lfJAOsDq0lL7VWPPkPjAlh5XSxxpFKpeSEUxo0M6bSU9rjJqrlIkAtyb0MGCaS2+3lewVpOQgGcWRYbKcDkl6NESmkewlF2l1mhAmdX+xMjxmIRuggn2DtD0mh5O2+6ZwgFkoUouptGyG2i8Y8iwlVllJQBhnQOweg2Felfh9SqeYwJXS/QlQFmlMo8lw6KwJSW+KJFrGkuFoZ1LW3kh/3kS+Bst0kJeB0lS+Dl9TcqhYS4akXcJkBmwtGSoeWFFSpFUMktoDo/ZyYIsmtDtUrJKviJTvGZg2kmFp1+7S8dtK/dVhRqN2Eh4sGJBhab3lQcbjGz+34teBDNlZlNmYTA6OjwEVd1KKLZyKPSRY9LkOqxBkiI9p1efeibCIVn2i0fBrV077poBAyLdSvkJM5XLVPIRsRZzS+kbIsJWiA2tgIiPzIFmK9cNf+oUmOZ/HAZW+SDkfxOqZl//LP/zyWck3QL42VBISsrBIEd0H9+1nrkvo09wOpqsORJGQWVBJiPv1XXgCJkvj2aepltbtjmgOpultm8ojXGUgJDy/8W8Aisx2feuks0rYznU0GWEtA0Vo/cZv2T1dMfs0BmxJOis17ZhZk0yGo7t+usf58s+4Ph2tShZwuADmQILZH195ot1xurKxz3LZE2rHbgcQYJf7X9Lv+jr0WYKSqOmFZfje5wIfn209X+yuby+T93VVfcVO8mDLcm1xeny4t74svSFFlBIhD0Rw+NRL8pyO5FJofP9H/NOz35IN5J2IKE2IoS6DDN5fXBL7J4KIj8ZPjOSC8n4ZTwpNDIZBVECXIeEiGwJp1n2XEuJ6r4zH8BRRhIchw7eCQrqooiyLBqYjOc3c5DgsE73XTKhQaTDyEHAIRZTg6i5zYpOAEOcdUQHqlxP+bgBKU0KHOdHQyumzQdBWTUeygjFgzn1S6T2JYtDfB89RSiMO+Cq4N7pRql1BAUxJ+PNaRsDmsE/RXz+fWeAEhnAlogHt8+bVgwBKXX3eYPB7oBdPK9pmbGOrH2h1CAFFWUrsEqRF3cB07i6wF+YVHC+FcX4oBxJFlBICViRFNRFvoeiFmsVblH8B7ABECbhRSVZTUJC+wZh/Gb4sCKaVQautAdK3kUpd3GgYuQCVwavtbaciyPp8TWdj7AfaH1KVy6htSZKS6E8dq7/bpGX5oT+34dsodORAuKzaiiQZEVZPquyGFYwWYeT9UMZzhdr2HHB7eUDjSZJRQkJXh84ZdWNe8Scp0748pzS231ak0xpLkgzJ4cjH40mSmT73D+Jkix88loT33tX3kzGAvXZDx32KI0lekqVYz57hT5POXffJ2ndfOBUK9cNElqAS1pdVeO0z7Rhcx/jCQRoYRdx9q+WOctN1+1zwG1IhPoEsbkpN9QPuhxyPNjr6hEkANctvn/pXqH+4Od909Ln4/qJERD+64GeqdYfw65BjuYkiSR6Ix039V4AfvDvt1uUbKJ9gsvBG9TV17S2eM9DVhk7r//6F/u9/5O2zvFd8OkmY/MgFeKTSB+Glqsevewuz+R17xjF9EvlY+PFpY8x+bIs7VH6RRas2eus+C9YzHVx+1u4xmW4+yzsspr/5jz/bmhAXOo7gQvWjhM8rsK/MAuQeD6SrOPrj6Gfv9v3io7zU53h1lbH+1Z9fjhQXsxJh0Qql+ay3zAOnbY+kuwVcG/26vgvUj4PV1ZzPUD8dbzLPh1MdLrhsJrBMZcmAfM8ECbhE0kJw/S5QP7y2XneNPkF978aqc0qli4q4DFjhqE5RddVX57ng/dWCtEMY3YP67s31xh3mx397MbPtjqVcuI2AKdWTOv2vuWhJPGBgPLlzb7ZWOn3OLtKQLuVHeNJEwAqpax37SbKBiSHJTiWjADK39QmyA9LkR2qM6huwqvZJP+FVNjCxAOykgGR78xnX7jv9OKS+E6CsGpp+ygamBUyvJGz6HBsMxqS5TVOBuwYC5kJ3QuXeg6YHd9lgLbVtyRaimx2DthGCFQagoLHdcJeG73aAR3NhF/6qbtDKw8LGhIhvXbgg6qbJoeYBh03MszoHMNu/Wo2xld4O0cXLtIAvZoGVOBsDwRhSc4uVw0830xjJ39Di+vEryZ+RR+MMRGlpn8Pzy8eyc9LuOqm7SS4dLBJ3hhUXnF/ePtL1S+reah09BXg3KT9LJmWwSmRryM3nx9eyY7tUXktUvSBR1ec3yac4PAoKiV7v4f3VjW7tEVyS7r8heZWNWFdHfVWAtFnnTf3o1COLu+TRt9wcGWs27a2CtzacVICKXRKglFx6kxc+bcfq+TcXH2LUvRFguUOLklHNy+B+scKATTYSEvbI601mHFh1A8zqyS5HqYyR3L7kZbga69YqF6wHYiIi2b3MjANF2g9gLVOS/JqZwe19BS5ggyX6+zk3DpLdFtAGUIa2hBX7y+z0d1kGZqcK81qibaAhDOHxxr4CbtLb3pFd+wrKBwlL7TltayjiIV+TvfUkgG8Ha0QUbAGMJBHtC3PEVj8do/tEf6NtjSENlUqHmGA/tW87YCNpKjXdy1qFh+RYBqnttb9Tw8K81WSAdkEO25BP/YR03Q1DJ1Ny7puSoHQBbOPdgzR2nrKDXcMDQZG8SYrSzd1WkpVxdgC7Ba6+niJDbY0crh6T4+eu4TaS8woPpCjdvMnCYJXM3ZgxB0hRhBw0LXUqKcrXgspREdjIlXngZEmaXwWBHIwLFnfMlJm4N2GY8hUwKseTCcBMATQ5Gz1EuedbasnIbYDyRkBXAcYdexgZQTPgs6bi4CsYCyjgAdWmZj1X1EY+kINt1TSYDz1gWwBL6psWWscZgNbzCxl0Vb6iBaT5kmnhixWPY4KqIT2RDN7dSLIOviXBfSK+oWmBH6ovXFHT44ODrYODZ8mgu5LyvDsOA0HinlucpFapdfCFXLorvejREBAkvqBd4LjWqzlQ3VJ6gv4/AYl/CwJ2gacaShadbkradmgAihOij0WCdgENKd1X+aqWLeKLVD92AQzSfcGrLTswH2zLEv8MV6lb2IVMCl4fybdBPaGp/aR6ei6d/MXXwKxBoecu6NW4gjvtoeWjswfp6O+6418Mh7LBndT2NACs2jMe7iqd/UN3+Ifk5CRTJfWluSF46RNX1pQ+/gUdOMyTskfui3sVAnvCw9GV9PRxehTkeQYgOSCiYQV8ZE+vJntK14vurHUg1wIkwOOTeHBeASfmzJXlQyWDv+/OaDCsQDI4ljfaQN0PwETzpNuXSh5/1xkZiopAFriZ/6CGEcIeEtzV3OjBrpLN4ffiDzQKsLUe/XcNjAW4AMw0H7rKveS06I6TQRBKxqXQ4bKov0sDPgeA6dnRU/f047Tgs+R1xY4o2HfbSoy+/YMkbAuwRss+PRi8WIYTu6SnG9v3uzPJ7SZdAbDXtlxp+xgbmxatsh1IdffOfPK9pr0MlbPvPiyvvnbt6Wvk14eOPNtLuw2WCFbSAaSDVcAHp1o/+eQR7XAE7uaNKU820AVX0U6nuO6fLaNBpkg2520P6/DxK3D26GHTPDPdag9m1W9yVNi5adqriKNu2RvTKQKNrJmsETUjPDSs4/feov9x9/h0/MzsUHF9jatZO9WfnY0kyzJrWosshPHQsAZ//v6O3rMHbm5OBzITV9VNt7b6Ij2dpBhj52qZnUFDVqz2cbE9cBe//vleQx4vuLKPunXTF8Grr86DXJp5bjHgktrsoQAq2A51193m1uU4q1eXduqtL1jePUFBxmK4BAsB69pW7FKzJdu6g3nOLsNXUOuVtdGp9774+F//y7WhWWtjtTUmo678P2E/18FWak8WXMJnV+T8i12664mrMreFL3mZmkEgz76sIayFtjKvitVl+Iasu9al3Z6QYDC0iRk2QOTTvzRKy1YxgYdDe662WUM71JcXhmaYHWNxYWEbyp3iTfXjIaG6d05PGHh5VM8yt+rQWR5nRsPZ2JpKBcjTm8NxIZjQvAazr24O7MZ8WfOGG52xL9hmzLBac6/jUSH88HB9TJtGqP9mDkzfceU/3w2cK48zax6TkzdlPT09bbfS+nxY0zOuenXdjiz3xbJbs40pnfK2xMvzlyNbsLUY1vO+8lBndqM3x3YzlGbUAORqo2asfSBRWZ20B5Oo81qrIc33vkMfLl2yC/ZHCCxLABuPaNld6boxEKVpTp46lLTfLVDkF+Q/RZoPcMObPbJ9gJg09By3srJNUBiuTyIEnteZ7b1JcPcpAdbYO8GTpOT3AoexLlq1wZ7q2k57I9XbHt0t/bVKiXNe7TMB/Foh/y3ACMPAWxB+yD8FEXYcMKCw9duC83eKT+rAAIqyd75us5XQ/iOvrzGF4L7RlL61CjbRgQ07QXs9msvfdwqbn44JcV5HZ6ZH10bwJy/ltdZUb1tM72TqGZnWxXAZj+TsYCGi21zK3P61GsvPV20s2QCDY+YXdys/avBfcqiAjhTQ+r1iRJ5LzvBDQCbeRh0XLi2Iq0YX5seZ7XKXGNz+tF7M45e4/CbzJYzKsiwqgNX1zb29w5NrlT4tyoLgpEkIwMlvSHAJq01ACUqZTu75uR+ftDNvwh9fag/X8tOS7gsm4PUOgKJEaMe9pGgD+UowI7YBKRoAMvkHUqwNKzkKveV48sWXzPY+i0aKOKHO/xiJ38zpR3dXDghuRQSwIX1eFghQNjBgOpOAyVJFCCfgOJoGgCT77hstfidCW/MWmXTeivof3791JUREaSZiSxK1QfHyE0BL7bl//0F3CE2pL2PQkkS/aSxhAxgnGheAybAA/u6wGZ/dIo+/p/Xv7m74QlhRmglIspt1lJh6XnYDroGNBhbO5vTJVGohJbBxf8niUTIE/n7WbMEV6Yh5K3P2tsBZjdGUGelKpbTqeifegGkDsNDJX1LhG9RnsIFRIKLRWId/uqvVwu32ahCY0+IcWAWkOsbcYsDnIamu+7R7AF6mJ81lHPPn7ifz+kaASQw9RYUN2vzDv33317XqV09xNYq/wxb0O5MxwISiihEDlsUPgrrH/mV85xmtAAQU0mAAGwHx6OYmmToPY7MtIUZlBStWKbbA+XG9u1yVv50zBuOoD+VPj1n8DEVRBAb+sCCATwTVNEWAyey6BDY0BB4BoQsZlkDguVFENMuWdM6OlMIyrB2nJ/7u137yABcD/Jqf4+LjDrkULPrnDYTf/FNxQ+8YKKi0whQEEOCFcMhOBGA5Tbc28NJT7RbwiXYnCbZuc0hFFBUGxKoBxKxZRy/2wW/9VQvUFqBeRAuCrkk2d17NYHvunMZTPlE5JabUN9I67LlwRKXBElhgk04rO8PoJ7RbYAPhfUYBaM3zAHfOFVEabg/I04+PLBBm7aQ1WB8Hzz8LFi1APdDJOwD3Lh2Sz6PTm1O2WxrP58x2qbzO3vshqS9xhS3XBambCAxbxgaB6DZ643q7BRaBsihHAmPT052NqQCVQ4Sng/r4CCPmPpXmnnwk8MMHX/D8s7TsrPt9eJ+dkk8RoOWQfn9E9Yj9jfJI/MMxAi4URVGQkDjAYAzqDWmzWdx6PQBeABTjaWylXYyiA372G4CKztcUhj1+dJzCirnfPBXgDbtH402azj0vzFaPH27YHt2enL+TVWPJd75/SPU9DiK1NdIrwRMALwgq3CmFki0kpIgiINfLjnsXAN0A0LjIonMHnn2+Zft7qJTYdwjQoMiCLM/rgugkKbLYnZEzOeDkR7RcuTv3of65FT/4wa83T7ap/GjBEIgrlRLUE8iExKYUeYvYColMZ1fCroGgJ58s2PeX/q5p6a1HqClN2b7TwCWIlBZWRLojFJLolex0unNmz+sfcBXfj20Awj/+kuOjgvAP/35+j/MntFbFowvBSu/XnwNNYyNFKATgzjmbTYB7Kyor/MS79VsAlaYZe8eDG3VhZGvakRTprm2EAIHsxGmnszuacyWLNVpAgJ//M9ufJvDbX/3wP//2X35N1BhGktr3Gmr7gPrwfSYipJCQnXbmdDKZTIFlrXXe+tUX9EQpS3phAYtBHa3ZzqIractyj2ghVyisMGvrSJ5dtg7w8N7DZJjnMYiuECBI+OXf/INBuwsQjrvANkeV56vg9/+U9lyVz79mzw3tFjBwNqjjeQNG7o0GbZoijgkkJKRNJM8Wdx/3tze3bBZnJ8klbK8NhKJYMpiOx2iObzwJbQCK07GxyfI9l5tPXN/1n//jfz2cf0Mmcms5pPWNuQrQupErYVnjUFOmyQpAyPB04aOeMSYIQAjhbd12alcXYKME84l39QR3QNQBPXx6CUUsu0UammUVlAWEJX27R4YFRp0KaksTIpC0tS3kfLRj+2ah/t9ENpz6/krThHdU5zgtwLPWzOi22B3MGK7/F4BCth5WENZ1QhNibZkVGVaQFCUwPsxGs6tGwsb0iyhRYtPpZJPZmclsCYGW6xizCnvOSXVNCoVwbJUTQ5qUaE4eBXDt4wFNF2zruqxpQpmakDQrJ4wzVjVkRrwFaVWyty52JGgNtht4AmRnb0UZNSWCdE4dI8v2+to4gAogzNxv1IOBkMhNLBtjknJulCZCAVyrqfifP3zUA9s101QTao51Wh0dDNKGNpRRz/CAVgOSnTEOvGF9AJjpmjX8VMcDgl2XxHhSRo0EdD8FthNWYQDaKgWaQVyDSnk0OwfGxkgnRGIpioA7HyTzoxP237Y8d3M6HyqvDfIT3wXMxx4+k2B55llazlvhm6/XewQ/WcWqgHpCdYynx0dHRyHAoFSwwcvHIIu/mz0uCMzT3OKFMbhn7gZMqXqQx67BfuuVgfzf/z1Z9gMUBnfYnZ3JAYuiQBadN7EzkuKu0mrVi42yAhhdV85XnL9pJtGR6Q2y07LARnz6dLy/CpsS3HrQbEogEXLBuLE9RMtCWeKQxsa0PPmteRnC/PPhCM/zqOzVbZyJbMKKUJxvMdRYOuoa7V9Iql4vhyKWaKKUpnQda5yQaScZUkjZ7a0WHEvYETMHFiHEZhMM8sJjXqclhkHmuRu1F+MC8/kcqOSZjwuQ683GihIREgSYA8eRbrpJ61+kprJ4sFhtjBTNeDw5HgPtHov6u6DGiQJGUcIuMoSiiVCSkTadQcZkt1ks17GvVHoPrOJsMkLQLTZ2u+flrTVGy0QPF+Tt1exiEJCalfmDHI9HhkACbKUtvJ9UFjVsIF30ASjbGN+sUtO3HWLH7ZfCGkFZfvNoCcSoNI2EoomIImwLNtl1m1yuVobrr4xbanrB4pq4Lokdopl5mfaCYW55nZllWu+wbg5irf96f/0Q2q3typeL5vpxkTunpTSy5R2KEmxP90PMO6abcGjwYfPHjZZ2D5lT7fsq7S9da41gBZb378/ZM0BAR+/0+q3rtOzt+5TK8WxaEJx2MC8ziwmzYBhN1oyYe+9w1B2ieg6MJgXQKWh7tuv9L1ZlOhkVGWRQkiSm9+gFBZ5C9U3OY0Cl2notdfUT8WVAeGtxdqTW2Lv2QSa4+VXPefUT1cvbkxISslLZQ8aWNo3B2OxG81jmnu84OoSILM6oux5B27P98+XD7067QGLfyXO1stvjGKSsV4S3z9/UQGxdoV0YJYZSh8OqF0p7joivs[...]",

const FOLLOW_DISTANCE = 95;
const EDGE_GAP = 14;
const DESKTOP_WIDTH = 150;
const MOBILE_WIDTH = 112;

export function CuteFooterCat() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, pointerX: 0, pointerY: 0, pointerInside: false });

  useEffect(() => {
    const cat = ref.current;
    const footer = cat?.closest("footer");
    if (!cat || !footer) return;

    let raf = 0;
    let last = performance.now();

    const size = () => {
      const width = window.innerWidth < 640 ? MOBILE_WIDTH : DESKTOP_WIDTH;
      cat.style.width = `${width}px`;
      cat.style.height = `${width * 255 / 405}px`;
    };

    const bounds = () => {
      const r = footer.getBoundingClientRect();
      const w = cat.offsetWidth;
      const h = cat.offsetHeight;
      return { r, minX: EDGE_GAP, minY: EDGE_GAP, maxX: Math.max(EDGE_GAP, r.width - w - EDGE_GAP), maxY: Math.max(EDGE_GAP, r.height - h - EDGE_GAP) };
    };

    const home = () => {
      const b = bounds();
      state.current.x = b.maxX;
      state.current.y = b.maxY;
      state.current.vx = 0;
      state.current.vy = 0;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const b = bounds();
      state.current.pointerInside = e.clientX >= b.r.left && e.clientX <= b.r.right && e.clientY >= b.r.top && e.clientY <= b.r.bottom;
      if (!state.current.pointerInside) return;
      state.current.pointerX = e.clientX - b.r.left;
      state.current.pointerY = e.clientY - b.r.top;
    };

    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const s = state.current;
      const b = bounds();
      let tx = b.maxX;
      let ty = b.maxY;

      if (s.pointerInside) {
        const cx = s.x + cat.offsetWidth / 2;
        const cy = s.y + cat.offsetHeight / 2;
        const dx = cx - s.pointerX;
        const dy = cy - s.pointerY;
        const d = Math.hypot(dx, dy) || 1;
        if (d > FOLLOW_DISTANCE) {
          tx = s.pointerX + (dx / d) * FOLLOW_DISTANCE - cat.offsetWidth / 2;
          ty = s.pointerY + (dy / d) * FOLLOW_DISTANCE - cat.offsetHeight / 2;
        } else {
          tx = s.x;
          ty = s.y;
        }
      } else {
        const t = now / 1000;
        tx = b.maxX - Math.sin(t * 0.35) * 28;
        ty = b.maxY - 10 - Math.sin(t * 0.55) * 6;
      }

      tx = Math.min(b.maxX, Math.max(b.minX, tx));
      ty = Math.min(b.maxY, Math.max(b.minY, ty));

      const stiffness = s.pointerInside ? 0.00075 : 0.00045;
      const damping = 0.92;
      s.vx = s.vx * damping + (tx - s.x) * stiffness * dt;
      s.vy = s.vy * damping + (ty - s.y) * stiffness * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const bob = Math.sin(now / 700) * 1.8;
      const tilt = Math.sin(now / 1400) * 0.8 + Math.max(-1.5, Math.min(1.5, s.vx * 0.08));
      cat.style.transform = `translate3d(${s.x}px, ${s.y + bob}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };

    size();
    home();
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", move, { passive: true });
    footer.addEventListener("pointerleave", () => { state.current.pointerInside = false; });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="cute-footer-cat pointer-events-none absolute left-0 top-0 z-[60] select-none" style={{ width: DESKTOP_WIDTH, aspectRatio: "405 / 255", willChange: "transform" }}>
      <img src={CAT_ART} alt="" width={405} height={255} draggable={false} className="block h-full w-full object-contain" />
      <span className="cat-blink" aria-hidden="true" />
      <style jsx>{`
        .cat-blink { position:absolute; left:29.2%; top:45.2%; width:5.8%; height:11%; border-radius:50%; background:#fff; opacity:0; animation:blink 5.5s ease-in-out infinite; transform-origin:center; }
        @keyframes blink { 0%,88%,100%{opacity:0;transform:scaleY(.15)} 90%,94%{opacity:1;transform:scaleY(1)} }
        @media (prefers-reduced-motion: reduce) { .cat-blink{animation:none;opacity:0} }
      `}</style>
    </div>
  );
}
