export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const CLOUD_URL = 'https://superjsonblob.com/api/jsonBlob/b74953fa-6d2c-433e-9d64-c0f6b67c9e2a';

  try {
    if (req.method === 'GET') {
      const response = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
      const data = await response.json();
      const list = Array.isArray(data?.submissions) ? data.submissions : [];
      return res.status(200).json(list);
    }

    if (req.method === 'POST') {
      const newRecord = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const getRes = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
      const data = await getRes.json();
      const list = Array.isArray(data?.submissions) ? data.submissions : [];
      const filtered = list.filter(item => item.id !== newRecord.id);
      const updated = [newRecord, ...filtered];
      await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ submissions: updated })
      });
      return res.status(200).json({ success: true, record: newRecord });
    }

    if (req.method === 'DELETE') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (payload?.id) {
        const getRes = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
        const data = await getRes.json();
        const list = Array.isArray(data?.submissions) ? data.submissions : [];
        const filtered = list.filter(item => item.id !== payload.id);
        await fetch(CLOUD_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ submissions: filtered })
        });
        return res.status(200).json({ success: true, remaining: filtered.length });
      } else {
        await fetch(CLOUD_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ submissions: [] })
        });
        return res.status(200).json({ success: true, remaining: 0 });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

