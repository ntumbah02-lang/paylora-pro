const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

function ensureDataDirectory() {
  const dir = path.dirname(DATA_FILE);
  fs.mkdirSync(dir, { recursive: true });
}

function defaultState() {
  return {
    metrics: {
      totalVolume: 2847000,
      successRate: 98.7,
      activeMerchants: 128,
      pendingPayouts: 48250,
    },
    transactions: [
      { id: 'TXN-1024', customer: 'Aline M.', amount: 240, status: 'Succès', channel: 'Mobile Money', created_at: new Date().toISOString() },
      { id: 'TXN-1025', customer: 'Jean K.', amount: 1600, status: 'Succès', channel: 'Carte bancaire', created_at: new Date().toISOString() },
      { id: 'TXN-1026', customer: 'EA Logistics', amount: 890, status: 'En attente', channel: 'Virement', created_at: new Date().toISOString() },
      { id: 'TXN-1027', customer: 'Mia S.', amount: 340, status: 'Succès', channel: 'Orange Money', created_at: new Date().toISOString() },
      { id: 'TXN-1028', customer: 'Nuru Retail', amount: 1200, status: 'Échec', channel: 'Carte bancaire', created_at: new Date().toISOString() }
    ]
  };
}

function loadState() {
  ensureDataDirectory();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn('Could not read data file, using defaults:', error.message);
  }

  const state = defaultState();
  saveState(state);
  return state;
}

function saveState(state) {
  ensureDataDirectory();
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

const state = loadState();

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', service: 'Paylora Pro', timestamp: new Date().toISOString() });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/summary') {
    sendJson(res, 200, state);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/payments') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const transaction = {
          id: `TXN-${Math.floor(Math.random() * 9000 + 1000)}`,
          customer: payload.customer || 'Client anonyme',
          amount: Number(payload.amount) || 0,
          status: 'Succès',
          channel: payload.channel || 'Mobile Money',
          created_at: new Date().toISOString(),
        };

        state.transactions.unshift(transaction);
        state.metrics.totalVolume += transaction.amount;
        state.metrics.successRate = Number(((state.transactions.filter((t) => t.status === 'Succès').length / state.transactions.length) * 100).toFixed(1));
        saveState(state);

        sendJson(res, 201, { message: 'Paiement traité avec succès', transaction });
      } catch (error) {
        sendJson(res, 400, { error: 'Données de paiement invalides', details: error.message });
      }
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    serveFile(res, path.join(__dirname, 'public', 'index.html'));
    return;
  }

  const filePath = path.join(__dirname, 'public', url.pathname.replace(/^\//, ''));
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Paylora Pro running on http://localhost:${PORT}`);
});
