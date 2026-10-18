const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function validatePayment(body) {
  if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
    return { valid: false, error: 'amount must be positive number' };
  }
  if (!body.currency || typeof body.currency !== 'string') {
    return { valid: false, error: 'currency required' };
  }
  return { valid: true };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/payments', (req, res) => {
  const check = validatePayment(req.body);
  if (!check.valid) {
    return res.status(400).json({ error: check.error });
  }
  res.status(201).json({ id: 'pay_'+Date.now(), ...req.body, status: 'created' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Paylora Pro running on ${PORT}`));
}
module.exports = { app, validatePayment };
