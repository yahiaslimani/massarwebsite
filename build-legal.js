// Builds the static legal pages from the backend's Markdown (the texts the owner reviewed).
// Run from the website folder: node build-legal.js
const fs = require('fs');
const path = require('path');
const { marked } = require('../backend/my-transit-api/node_modules/marked');

const SRC = path.join(__dirname, '../backend/my-transit-api/src/');
const pages = [
  ['PRIVACY_POLICY.md', 'privacy-policy.html', 'Privacy Policy – Massar', 'assets/logo-64.png', '#1673C7'],
  ['PRIVACY_POLICY_DRIVER.md', 'privacy-policy-driver.html', 'Privacy Policy – Massar Driver', 'assets/logo-driver-64.png', '#0B7D4D'],
  ['TERMS_AND_CONDITIONS.md', 'terms-and-conditions.html', 'Terms and Conditions – Massar', 'assets/logo-64.png', '#1673C7'],
];

for (const [md, out, title, logo, accent] of pages) {
  const body = marked.parse(fs.readFileSync(SRC + md, 'utf8'));
  fs.writeFileSync(path.join(__dirname, out), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="${logo}">
<link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { --bg: #F7FAFD; --text: #0F1E2E; --muted: #4B5B6B; --accent: ${accent}; --line: #DCE6F0; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0E1620; --text: #E8EEF4; --muted: #A7B4C2; --line: #253342; } }
  body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.65 'Readex Pro', system-ui, sans-serif; }
  header { border-bottom: 1px solid var(--line); }
  header a { display: flex; align-items: center; gap: 10px; max-width: 760px; margin: 0 auto; padding: 14px 16px; color: inherit; text-decoration: none; font-weight: 700; }
  header img { width: 32px; height: 32px; }
  main { max-width: 760px; margin: 0 auto; padding: 24px 16px 64px; overflow-wrap: anywhere; }
  h1 { line-height: 1.2; }
  h2, h3 { margin-top: 2em; line-height: 1.3; }
  a { color: var(--accent); }
  li { margin: .25em 0; }
  table { border-collapse: collapse; display: block; overflow-x: auto; }
  td, th { border: 1px solid var(--line); padding: 6px 10px; text-align: start; }
</style>
</head>
<body>
<header><a href="./"><img src="${logo}" alt="">Massar</a></header>
<main>
${body}
</main>
</body>
</html>
`);
  console.log(out);
}
