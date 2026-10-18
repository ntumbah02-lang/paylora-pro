# Paylora Pro

Paylora Pro is an MVP fintech payments dashboard for tracking transactions, monitoring success rates, and simulating payment flows.

## Features

- Payment dashboard and KPI overview
- Recent transactions table
- Payment submission form
- REST health and summary endpoints
- JSON-based local data storage for demo mode

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## API

- `GET /api/health` — service status
- `GET /api/summary` — current metrics and transactions
- `POST /api/payments` — create a simulated payment

## Stack

- Node.js
- HTTP server (no framework)
- HTML/CSS/JS frontend
