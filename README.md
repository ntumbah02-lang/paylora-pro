# Paylora Pro - API Paiement Minimaliste

MVP backend pour gestion de paiements session unique. Construit avec Express.js.

## Installation

```bash
npm ci# dev
npm run dev

# prod
npm startcurl http://localhost:3000/api/healthcurl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"USD"}'npm test
npm run test -- --coveragenpm run lint
npm run lint:fixdocker build -t paylora-pro .
docker run -p 3000:3000 paylora-pro
