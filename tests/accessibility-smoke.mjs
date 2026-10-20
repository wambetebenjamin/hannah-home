import {chromium as p} from '../.cache/browser/node_modules/playwright/index.mjs';import c from '../.cache/browser/node_modules/@sparticuz/chromium/build/esm/index.js';import { readFile } from 'node:fs/promises';
process.env.LD_LIBRARY_PATH = `${process.cwd()}/.cache/browser/al2023/lib:${process.env.LD_LIBRARY_PATH || ""}`;
const b=await p.launch({executablePath:await c.executablePath(),args:c.args.filter(a=>a!=='--disable-web-security'),headless:true});const page=await b.newPage({reducedMotion:'reduce'});
const axe=await readFile('.cache/browser/node_modules/axe-core/axe.min.js','utf8');let failures=0;
for(const path of ['/','/services','/booking','/auth/signup','/professionals','/legal/privacy-policy']){
 await page.goto(`http://localhost:3000${path}`,{waitUntil:'networkidle'});await page.waitForSelector('.preloader',{state:'hidden'});
 if(await page.locator('.consent-banner').count()){await page.getByRole('button',{name:'Manage Preferences',exact:true}).click();await page.getByRole('button',{name:'Necessary only',exact:true}).click();}
 await page.addScriptTag({content:axe});const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
 const list=result.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length,items:v.nodes.slice(0,5).map(n=>({selector:n.target,summary:n.failureSummary}))}));console.log(path,JSON.stringify(list,null,2));failures+=result.violations.length;
}
await b.close();console.log('Violation groups:',failures);if(failures)process.exit(1);
