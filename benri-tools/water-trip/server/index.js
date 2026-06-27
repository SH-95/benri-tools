// Local Express proxy for testing the serverless API locally.
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json({ limit: '5mb' }));
const TARGET = 'https://jsonblob.com/api/jsonBlob';

app.post('/api/blob', async (req, res) => {
  try{
    const { cards, blobId } = req.body || {};
    if(!cards) return res.status(400).json({ error: 'cards required' });
    if(blobId){
      const r = await fetch(`${TARGET}/${blobId}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(cards) });
      if(!r.ok) return res.status(502).send(await r.text());
      return res.json({ ok:true, blobId });
    } else {
      const r = await fetch(TARGET, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(cards) });
      if(!r.ok) return res.status(502).send(await r.text());
      const location = r.headers.get('location') || '';
      const id = location.split('/').pop();
      return res.status(201).json({ ok:true, blobId: id });
    }
  }catch(e){ console.error(e); res.status(500).json({ error: e.message }); }
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log('Local proxy running on', port));
