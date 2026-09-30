// Builds the static legal pages from the backend's Markdown (the texts the owner reviewed).
// English is <name>.html; translations are <name>-fr.html / <name>-ar.html, from <NAME>.fr.md / <NAME>.ar.md.
// Run from the website folder: node build-legal.js
const fs = require('fs');
const path = require('path');
const { marked } = require('../backend/my-transit-api/node_modules/marked');

const SRC = path.join(__dirname, '../backend/my-transit-api/src/');
const docs = [
  ['PRIVACY_POLICY', 'privacy-policy', 'assets/logo-64.png', '#1673C7'],
  ['PRIVACY_POLICY_DRIVER', 'privacy-policy-driver', 'assets/logo-driver-64.png', '#0B7D4D'],
  ['TERMS_AND_CONDITIONS', 'terms-and-conditions', 'assets/logo-64.png', '#1673C7'],
];
const LANGS = { en: ['', 'English', 'Massar'], fr: ['.fr', 'Français', 'Massar'], ar: ['.ar', 'العربية', 'مسار'] };

for (const [md, out, logo, accent] of docs) {
  const available = Object.keys(LANGS).filter((l) => fs.existsSync(`${SRC}${md}${LANGS[l][0]}.md`));
  for (const lang of available) {
    const file = lang === 'en' ? `${out}.html` : `${out}-${lang}.html`;
    const body = marked.parse(fs.readFileSync(`${SRC}${md}${LANGS[lang][0]}.md`, 'utf8'));
    const title = body.match(/<h1[^>]*>(.*?)<\/h1>/)[1].replace(/<[^>]+>/g, '');
    const switcher = available.length < 2 ? '' : `<nav>${available
      .map((l) => (l === lang ? `<span>${LANGS[l][1]}</span>` : `<a href="${l === 'en' ? out : `${out}-${l}`}.html" hreflang="${l}">${LANGS[l][1]}</a>`))
      .join('')}</nav>`;
    fs.writeFileSync(path.join(__dirname, file), `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="${logo}">
<link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { --bg: #F7FAFD; --text: #0F1E2E; --muted: #4B5B6B; --accent: ${accent}; --line: #DCE6F0; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0E1620; --text: #E8EEF4; --muted: #A7B4C2; --line: #253342; } }
  body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.7 'Readex Pro', system-ui, sans-serif; }
  header { border-bottom: 1px solid var(--line); }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; max-width: 760px; margin: 0 auto; padding: 12px 16px; }
  .brand { display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; font-weight: 700; }
  .brand img { width: 32px; height: 32px; }
  nav { display: flex; gap: 6px; font-size: 14px; }
  nav a, nav span { padding: 4px 10px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); text-decoration: none; }
  nav span { background: var(--accent); border-color: var(--accent); color: #fff; }
  main { max-width: 760px; margin: 0 auto; padding: 24px 16px 64px; overflow-wrap: anywhere; }
  h1 { line-height: 1.25; }
  h2, h3 { margin-top: 2em; line-height: 1.35; }
  a { color: var(--accent); }
  li { margin: .25em 0; }
  em { color: var(--muted); }
</style>
</head>
<body>
<header><div class="bar"><a class="brand" href="./"><img src="${logo}" alt="">${LANGS[lang][2]}</a>${switcher}</div></header>
<main>
${body}
</main>
</body>
</html>
`);
    console.log(file);
  }
}
