export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const CLOUD_URL = 'https://superjsonblob.com/api/jsonBlob/3d200bc8-02f3-4923-9193-8cff83dbf768';

  try {
    if (req.method === 'GET') {
      const response = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
      const data = await response.json();
      const list = Array.isArray(data?.schools) ? data.schools : (Array.isArray(data) ? data : []);
      return res.status(200).json(list);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const getRes = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
      const currentData = await getRes.json();
      let list = Array.isArray(currentData?.schools) ? currentData.schools : (Array.isArray(currentData) ? currentData : []);

      if (Array.isArray(payload?.schools)) {
        list = payload.schools;
      } else if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && (payload.id || payload.domain)) {
        const idx = list.findIndex(s => s.id === payload.id || (payload.domain && s.domain?.toLowerCase() === payload.domain?.toLowerCase()));
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...payload };
        } else {
          list = [payload, ...list];
        }
      }

      await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ schools: list })
      });

      return res.status(200).json({ success: true, schools: list });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
