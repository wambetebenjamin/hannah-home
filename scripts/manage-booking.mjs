import { kv } from '@vercel/kv';
const [reference, action, ...options] = process.argv.slice(2);
const name = options.find(x=>x!=='--confirm-live');
if(!/^HH-[A-F0-9]{12}$/.test(reference||'') || !['assign','complete','cancel'].includes(action) || !options.includes('--confirm-live')) { console.error('Usage: manage-booking.mjs REF assign "Verified Name" --confirm-live | REF complete --confirm-live | REF cancel --confirm-live'); process.exit(1); }
if(!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) { console.error('KV credentials are required in the environment. Values are never printed.'); process.exit(1); }
if(action==='assign' && (!name || name.length<2 || name.length>100 || /[\r\n<>]/.test(name))) { console.error('Supply the verified professional name.'); process.exit(1); }
try {
 const booking = await kv.get(`hh:booking:${reference}`);
 if(!booking) throw new Error('not-found');
 if(action==='complete' && Date.parse(`${booking.date}T${booking.time}:00+03:00`)>Date.now()) { console.error('A future service cannot be marked completed.'); process.exit(1); }
 const result = await kv.eval(`
  local raw = redis.call('GET',KEYS[1]); if not raw then return 'NOT_FOUND' end
  local b = cjson.decode(raw)
  if ARGV[1] == 'assign' then
    if b.status ~= 'pending' and b.status ~= 'confirmed' then return 'INVALID_STATE' end
    b.professional = ARGV[2]; b.status = 'confirmed'
  elseif ARGV[1] == 'complete' then
    if b.status ~= 'confirmed' or not b.professional then return 'INVALID_STATE' end
    b.status = 'completed'
  elseif ARGV[1] == 'cancel' then
    if b.status == 'completed' or b.status == 'cancelled' then return 'INVALID_STATE' end
    b.status = 'cancelled'; local count = tonumber(redis.call('GET',KEYS[2]) or '0')
    if count > 0 then redis.call('DECR',KEYS[2]) end
  end
  redis.call('SET',KEYS[1],cjson.encode(b),'KEEPTTL'); return b.status
 `,[`hh:booking:${reference}`,`hh:slot:${booking.serviceId}:${booking.date}:${booking.time}`],[action,name||'']);
 if(['INVALID_STATE','NOT_FOUND'].includes(result)) { console.error(`No update performed for ${reference}: ${result}`);process.exit(1); }
 console.log(`${reference}: ${result}. Notify the customer through the approved coordination process.`);
} catch { console.error('Update failed. Check the reference, provider connectivity and operator permissions.'); process.exit(1); }
