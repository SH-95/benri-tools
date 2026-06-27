// Vercel / serverless handler example
// Deploy this file under your project root `api/blob.js` for Vercel,
// or adapt to Netlify functions. It proxies to jsonblob.com from server side.

export default async function handler(req, res){
  try{
    if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || (await new Promise(r => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(JSON.parse(d||'{}'))); }));
    const cards = body.cards;
    const blobId = body.blobId;
    const targetBase = 'https://jsonblob.com/api/jsonBlob';
    if(!cards) return res.status(400).json({ error: 'cards required' });
    if(blobId){
      // update existing
      const url = `${targetBase}/${blobId}`;
      const r = await fetch(url, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(cards) });
      if(!r.ok) return res.status(502).json({ error: 'remote update failed', status: r.status });
      return res.status(200).json({ ok:true, blobId });
    } else {
      // create new
      const r = await fetch(targetBase, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(cards) });
      if(!r.ok) return res.status(502).json({ error: 'remote create failed', status: r.status, text: await r.text() });
      const location = r.headers.get('location');
      const id = location ? location.split('/').pop() : null;
      return res.status(201).json({ ok:true, blobId: id });
    }
  }catch(e){
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
