import test from 'node:test';
import assert from 'node:assert/strict';
import { services, getService, formatMoney, formatTime, packageIds } from '../lib/catalog.ts';
import { validDate, nairobiDate, slotIsFuture, bookingSchema, bookingDetailsSchema, contactSchema, reviewSchema, phoneSchema, emailSchema, authFormSchema } from '../lib/validation.ts';
const future = nairobiDate(new Date(Date.now() + 3 * 86400000));
const input = { serviceId: 'house-cleaning', packageId: '2-bedroom', date: future, time: '10:00', area: 'Kilimani', address: 'Test apartment B4, Example Road', instructions: '', name: 'Preview Customer', phone: '0712345678', email: 'test@example.com', payment: 'mpesa', consent: true, captchaProof: 'signed-proof', idempotencyKey: '3c9d2399-ef83-40a4-a4ba-64ad9b457c56' };
test('catalog has all eight unique services and three server-priced packages', () => {
 assert.equal(services.length, 8); assert.equal(new Set(services.map(s=>s.id)).size,8);
 for (const s of services) { assert.equal(s.prices.length,3); assert.equal(s.hours.length,3); assert.ok(s.prices.every(n=>n>0)); assert.ok(s.included.length>=4); assert.ok(s.exclusions.length>40); assert.equal(getService(s.slug),s); }
 assert.equal(packageIds.length,3); assert.equal(formatMoney(2500),'KSh 2,500'); assert.equal(formatTime('13:00'),'1:00 pm'); assert.equal(formatTime('08:00'),'8:00 am');
});
test('Nairobi calendar date is based on UTC+3, not server local time',()=>{
 assert.equal(nairobiDate(new Date('2026-10-20T22:00:00Z')),'2026-10-21');
 assert.equal(nairobiDate(new Date('2026-10-20T20:59:00Z')),'2026-10-20');
});
test('dates reject impossible, past, malformed and distant days',()=>{
 const now=new Date('2026-10-20T09:00:00Z');
 assert.equal(validDate('2026-10-20',now),true); assert.equal(validDate('2026-10-19',now),false);
 assert.equal(validDate('2026-11-31',now),false); assert.equal(validDate('2026-10-32',now),false);
 assert.equal(validDate('2027-04-01',now),false); assert.equal(validDate('20-10-2026',now),false);
 assert.equal(validDate('not-a-date',now),false);
});
test('time slots enforce the two-hour lead time in EAT',()=>{
 const now=new Date('2026-10-20T06:00:00Z');
 assert.equal(slotIsFuture('2026-10-20','10:00',now),false); assert.equal(slotIsFuture('2026-10-20','13:00',now),true);
});
test('booking schema accepts valid data and strips forged prices/ownership',()=>{
 const parsed=bookingSchema.parse({...input, price:1,ownerEmail:'other@example.com',status:'completed'});
 assert.equal(parsed.email,'test@example.com'); assert.equal('price' in parsed,false); assert.equal('ownerEmail' in parsed,false); assert.equal('status' in parsed,false);
});
test('booking schema rejects unknown services, packages, dates, slots and missing terms',()=>{
 for(const overrides of [{serviceId:'unknown'},{packageId:'4-bedroom'},{time:'23:00'},{date:'2000-01-01'},{date:'2026-11-31'},{consent:false},{payment:'card'},{captchaProof:''},{idempotencyKey:'anything'},{phone:'123'},{address:'xx'},{email:'bad'}]) assert.equal(bookingSchema.safeParse({...input,...overrides}).success,false,JSON.stringify(overrides));
});
test('booking form validates each field with the same schema',()=>{
 const parsed=bookingDetailsSchema.safeParse(input); assert.equal(parsed.success,true);
 assert.equal(bookingDetailsSchema.safeParse({...input,instructions:'a'.repeat(501)}).success,false);
});
test('Kenyan phone forms accepted without silently inventing a number',()=>{
 for(const phone of ['0712345678','0112345678','254712345678','+254112345678']) assert.equal(phoneSchema.safeParse(phone).success,true);
 for(const phone of ['123','+15555555','254000000000','0712 345 678']) assert.equal(phoneSchema.safeParse(phone).success,false);
});
test('emails are normalised and reject line breaks, homoglyphs and injection',()=>{
 assert.equal(emailSchema.parse(' TEST@EXAMPLE.COM '),'test@example.com');
 for(const value of ['x@example.com\r\nBcc:evil@example.com','x＠example.com','not-email']) assert.equal(emailSchema.safeParse(value).success,false);
});
test('contact validates consent and bounded text',()=>{
 const contact={name:'Test Person',email:'test@example.com',phone:'0712345678',message:'I would like a cleaning quote.',consent:true,captchaProof:'ticket'};
 assert.equal(contactSchema.safeParse(contact).success,true);
 assert.equal(contactSchema.safeParse({...contact,message:'short'}).success,false);
 assert.equal(contactSchema.safeParse({...contact,message:'x'.repeat(2001)}).success,false);
 assert.equal(contactSchema.safeParse({...contact,consent:false}).success,false);
});
test('ratings and references cannot be forged into unsupported values',()=>{
 const review={bookingId:'HH-123456ABCDEF',rating:5,comment:'A thoughtful and helpful service.',captchaProof:'ticket'};
 assert.equal(reviewSchema.safeParse(review).success,true);
 for(const overrides of [{rating:0},{rating:6},{rating:4.5},{bookingId:'../../secret'},{comment:''},{captchaProof:''}]) assert.equal(reviewSchema.safeParse({...review,...overrides}).success,false);
});
test('sign up requires a name, valid email and explicit terms consent',()=>{
 assert.equal(authFormSchema.safeParse({name:'Test Person',email:'test@example.com',consent:true}).success,true);
 assert.equal(authFormSchema.safeParse({name:'T',email:'test@example.com',consent:true}).success,false);
 assert.equal(authFormSchema.safeParse({name:'Test Person',email:'test@example.com',consent:false}).success,false);
});
