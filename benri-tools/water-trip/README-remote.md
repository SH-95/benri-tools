Serverless proxy + jsonblob usage

Overview
- This adds a small serverless proxy endpoint that forwards client requests to jsonblob.com.
- Deploy the file `api/blob.js` to Vercel (place at project root `api/blob.js`) or adapt for Netlify.
- For local testing a small Express proxy is provided under `server/`.

Local test
1. Install and run the local proxy:

```bash
cd benri-tools/water-trip/server
npm install
npm start
```

2. Open the app and set the remote API URL in the browser dev console (if serving site via `localhost:8000`):

```js
window.REMOTE_API_URL = 'http://localhost:9000/api/blob'
location.reload()
```

3. Use the "URL 공유" 버튼 to upload and get a `?blob=ID` link.

Deploy to Vercel
- Move `api/blob.js` to your project root under `api/blob.js` and deploy to Vercel.
- The client will call `/api/blob` (relative) when `window.REMOTE_API_URL` is not set.

Notes
- jsonblob free entries expire by default; check jsonblob's expiration policy. For long-term stable storage consider other backends or a small DB-backed server.
