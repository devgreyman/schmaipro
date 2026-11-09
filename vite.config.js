import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiMiddlewarePlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  const subsFile = path.join(dataDir, 'submissions.json');
  const classesFile = path.join(dataDir, 'classes.json');
  const schoolsFile = path.join(dataDir, 'schools.json');

  const ensureDir = () => {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(subsFile)) fs.writeFileSync(subsFile, '[]', 'utf8');
    if (!fs.existsSync(classesFile)) fs.writeFileSync(classesFile, '[]', 'utf8');
    if (!fs.existsSync(schoolsFile)) fs.writeFileSync(schoolsFile, '[]', 'utf8');
  };

  const readJson = (file, fallback = []) => {
    try {
      ensureDir();
      const content = fs.readFileSync(file, 'utf8');
      return JSON.parse(content || '[]');
    } catch {
      return fallback;
    }
  };

  const writeJson = (file, data) => {
    try {
      ensureDir();
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing file:', e);
    }
  };

  return {
    name: 'api-middleware-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Handle CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const url = req.url || '';

        // API: /api/submissions
        if (url.startsWith('/api/submissions')) {
          if (req.method === 'GET') {
            const data = readJson(subsFile, []);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(data));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const newRecord = JSON.parse(body || '{}');
                const list = readJson(subsFile, []);
                // Avoid exact duplicate IDs
                const filtered = list.filter(item => item.id !== newRecord.id);
                const updated = [newRecord, ...filtered];
                writeJson(subsFile, updated);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true, record: newRecord }));
              } catch (err) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          if (req.method === 'DELETE') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                if (parsed.id) {
                  const list = readJson(subsFile, []);
                  const filtered = list.filter(item => item.id !== parsed.id);
                  writeJson(subsFile, filtered);
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true, remaining: filtered.length }));
                } else {
                  writeJson(subsFile, []);
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true, remaining: 0 }));
                }
              } catch {
                writeJson(subsFile, []);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true }));
              }
            });
            return;
          }
        }

        // API: /api/classes
        if (url.startsWith('/api/classes')) {
          if (req.method === 'GET') {
            const data = readJson(classesFile, []);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(data));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const newClass = JSON.parse(body || '{}');
                const list = readJson(classesFile, []);
                const existingIndex = list.findIndex(c => c.code.toUpperCase() === newClass.code.toUpperCase());
                let updated;
                if (existingIndex >= 0) {
                  list[existingIndex] = { ...list[existingIndex], ...newClass };
                  updated = list;
                } else {
                  updated = [newClass, ...list];
                }
                writeJson(classesFile, updated);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true, class: newClass }));
              } catch (err) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }

        // API: /api/schools
        if (url.startsWith('/api/schools')) {
          if (req.method === 'GET') {
            const data = readJson(schoolsFile, []);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(data));
          }

          if (req.method === 'POST' || req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const payload = JSON.parse(body || '{}');
                let list = readJson(schoolsFile, []);
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
                writeJson(schoolsFile, list);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true, schools: list }));
              } catch (err) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
  server: {
    port: 5173,
    host: true
  }
});
