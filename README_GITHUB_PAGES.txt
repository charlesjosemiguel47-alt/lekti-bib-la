GID LEKTI BIB LA — VÈSYON SAN SOU-KATAB, PARE POU GITHUB PAGES

FICHYE YO (TOUT NAN MENM KOTE / RASIN REPOSITORY A)
- index.html
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png
- kouveti-gid-lekti-bib-la.png
- README_GITHUB_PAGES.txt

Pa gen katab icons ni images ankò. Tout fichye aplikasyon an bezwen yo chita menm kote.

ENSTALASYON SOU GITHUB PAGES
1. Kreye yon repository sou GitHub.
2. Louvri repository a, chwazi Add file > Upload files.
3. Dekonprese ZIP sa a epi telechaje tout fichye ki anndan li dirèkteman nan rasin (root) repository a. Pa mete yo nan yon lòt katab.
4. Peze Commit changes.
5. Ale nan Settings > Pages.
6. Nan Build and deployment, chwazi Deploy from a branch.
7. Chwazi branch main ak folder /(root), epi peze Save.
8. Tann GitHub Pages pibliye sit la. Adrès sit la dwe kòmanse ak https://.
9. Ouvri adrès sit la nan Google Chrome sou Android.
10. Peze meni Chrome (⋮). Chwazi Install app si opsyon sa a parèt. Si li pa parèt, chwazi Add to Home screen.
11. Konfime enstalasyon an. Aplikasyon an ap parèt sou ekran telefòn nan tankou yon aplikasyon.

ENPÒTAN POU ENSTALASYON
- Sèvi ak adrès HTTPS GitHub Pages la; enstalasyon PWA ak service worker bezwen yon koneksyon ki an sekirite.
- Pa chanje non fichye yo san ou pa mete menm chanjman an nan referans index.html, manifest.webmanifest ak sw.js.
- Si ansyen vèsyon an te deja louvri nan Chrome, fèmen/relouvri sit la oswa rafrechi li pou nouvo fichye yo chaje. Nouvo service worker la sèvi ak yon nouvo non cache.
- Si Chrome pa montre Install app touswit, verifye sit la fin pibliye, rechaje paj la epi gade meni (⋮) ankò.

CHANGMAN KI FÈT
- Retire sou-katab icons/ ak images/.
- Mete de ikon yo ak imaj kouvèti a dirèkteman bò kote 4 lòt fichye prensipal yo.
- Korije tout chemen fichye yo pou aplikasyon an jwenn ikon ak kouvèti a nan nouvo kote yo.
- Mete ikon yo nan manifest aplikasyon an epi mete yo nan lis fichye service worker la pou yo ka disponib offline.
