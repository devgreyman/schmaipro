export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const CLOUD_URL = 'https://superjsonblob.com/api/jsonBlob/de755bd7-db58-4963-a529-02028ef50c53';

  try {
    if (req.method === 'GET') {
      const response = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
      const data = await response.json();
      const list = Array.isArray(data?.classes) ? data.classes : [];
      return res.status(200).json(list);
    }

    if (req.method === 'POST') {
      const newClass = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const getRes = await fetch(CLOUD_URL, { headers: { 'Accept': 'application/json' } });
      const data = await getRes.json();
      const list = Array.isArray(data?.classes) ? data.classes : [];
      const existingIndex = list.findIndex(c => c.code.toUpperCase() === newClass.code.toUpperCase());
      let updated;
      if (existingIndex >= 0) {
        list[existingIndex] = { ...list[existingIndex], ...newClass };
        updated = list;
      } else {
        updated = [newClass, ...list];
      }
      await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ classes: updated })
      });
      return res.status(200).json({ success: true, class: newClass });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

