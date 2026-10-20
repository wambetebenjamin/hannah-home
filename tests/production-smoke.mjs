import assert from 'node:assert/strict';
const base='http://localhost:3001';let count=0;
function pass(value,message){assert.ok(value,message);count++;console.log('PASS',message);}
let r=await fetch(base);pass(r.status===200,'production homepage responds');
r=await fetch(base+'/api/services');pass((await r.json()).services.length===8,'production catalogue is available without credentials');
r=await fetch(base+'/api/auth/demo',{method:'POST',headers:{Origin:base}});pass(r.status===404,'production ignores the demo flag and blocks preview authentication');
r=await fetch(base+'/api/bookings/HH-000000000001',{headers:{Cookie:'hh_demo_session=forged'}});pass(r.status===401,'demo or forged cookies cannot unlock production records');
r=await fetch(base+'/api/availability?serviceId=house-cleaning&date='+new Date(Date.now()+86400000).toISOString().slice(0,10));pass(r.status===503,'missing hosted storage fails closed');
r=await fetch(base+'/booking');let html=await r.text();pass(!html.includes('Preview mode:') && html.includes('Online booking is not connected yet'),'production booking UI reports missing configuration, not fake success');
r=await fetch(base+'/auth/signin');html=await r.text();pass(!html.includes('Enter preview account') && html.includes('Google sign-in is not connected yet'),'production sign-in never offers a demo account');
r=await fetch(base+'/api/bookings/create',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'});pass(r.status===403,'production rejects cross-origin booking writes');
r=await fetch(base+'/404');pass(r.status===404,'explicit 404 has the correct HTTP status');
r=await fetch(base+'/500');pass(r.status===500,'explicit 500 has the correct HTTP status');
for(const path of ['/fonts/poppins-latin-400-normal.woff2','/fonts/IcoMoon-Free.ttf','/fonts/fontawesome-webfont.woff2']){r=await fetch(base+path);pass(r.status===200,`local font ${path} is served`);}
console.log(`${count} production fail-closed checks passed with HANNAH_DEMO_MODE=true deliberately set on next start.`);
