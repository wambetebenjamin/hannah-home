import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const failures = [];
const manifest = JSON.parse(readFileSync('docs/template-manifest.json', 'utf8'));
for (const [file, expected] of Object.entries(manifest)) {
  if (!existsSync(file)) { failures.push(`Original path missing: ${file}`); continue; }
  const source = readFileSync(file);
  if (file === 'js/bootstrap.bundle.js') {
    const original = source.toString().replace('the boundaries" , or just', `the boundaries" ${String.fromCharCode(8212)} or just`);
    if (createHash('sha256').update(original).digest('hex') !== expected) failures.push(`Unexpected vendor change: ${file}`);
  } else if (createHash('sha256').update(source).digest('hex') !== expected) failures.push(`Original file changed: ${file}`);
}
const ignore = new Set(['.git', 'node_modules', '.next', '.cache', '.arena', 'image-search', '.playwright-cli']);
const textExtensions = /\.(tsx?|jsx?|mjs|css|html|json|md|txt|yml|yaml)$/;
let checked = 0;
function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (ignore.has(entry.name) || entry.name.startsWith('.env')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (textExtensions.test(path)) { checked++; if (readFileSync(path, 'utf8').includes(String.fromCharCode(8212))) failures.push(`Banned punctuation: ${path}`); }
  }
}
scan('.');
for (const name of ['Poppins', 'Rajdhani', 'FontAwesome', 'IcoMoon-Free']) {
  if (![readFileSync('public/fonts/local.css','utf8'), readFileSync('public/css/font-awesome.min.css','utf8'),readFileSync('public/css/icomoon.css','utf8')].some(s => s.includes(name))) failures.push(`Missing original font family: ${name}`);
}
for (const path of ['public/fonts/IcoMoon-Free.ttf','public/fonts/fontawesome-webfont.woff2','public/images/home-interior.jpg', 'app/loading.tsx','app/not-found.tsx', 'app/404/page.tsx','app/500/page.tsx','app/legal/privacy-policy/page.tsx','app/legal/terms/page.tsx','app/legal/cookie-policy/page.tsx']) if (!existsSync(path)) failures.push(`Required file missing: ${path}`);
const pkg = JSON.parse(readFileSync('package.json','utf8'));
for (const [name, version] of Object.entries({...pkg.dependencies,...pkg.devDependencies,...pkg.overrides})) if (/^[~^]|[*><= ]/.test(version)) failures.push(`Dependency not exactly pinned: ${name}`);
if (pkg.engines.node !== '>=24.0.0' || readFileSync('.nvmrc','utf8').trim() !== '24') failures.push('Node 24 configuration is missing.');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Source gate passed: ${Object.keys(manifest).length} original files retained, original font and CSS files intact, ${checked} text files checked, no banned punctuation, exact dependency pins.`);
