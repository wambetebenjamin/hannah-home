import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
mkdirSync('.cache/browser', { recursive: true });
execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install','--prefix','.cache/browser','--no-save','--no-audit','--no-fund','playwright@1.56.1','@sparticuz/chromium@140.0.0','axe-core@4.10.3'], { stdio: 'inherit' });
if (process.platform !== 'linux') { console.error('The bundled Chromium checks target Linux x64. On other platforms, adapt the test browser executable to an installed Playwright browser.'); process.exit(1); }
mkdirSync('.cache/browser/al2023', { recursive: true });
writeFileSync('.cache/browser/al2023.tar',brotliDecompressSync(readFileSync('.cache/browser/node_modules/@sparticuz/chromium/bin/al2023.tar.br')));
execFileSync('tar',['-xf','.cache/browser/al2023.tar','-C','.cache/browser/al2023']);
console.log('Optional browser tools are ready under .cache/browser. Start npm run dev:preview before running the checks.');
