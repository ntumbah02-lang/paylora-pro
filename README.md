# Paylora Pro

Paylora Pro est une plateforme MVP de paiement conçue pour suivre les paiements, visualiser les métriques et simuler un flux simple de transactions.

## Fonctionnalités

- Tableau de bord de performance
- Suivi des transactions récentes
- Soumission de paiements de démonstration
- API HTTP simple pour l’intégration ou le test

## Démarrage

```bash
node server.js
```

Puis ouvrez :

```text
http://localhost:3000
```

## API

- `GET /api/health` : vérifie le statut du service
- `GET /api/summary` : retourne les métriques et transactions
- `POST /api/payments` : enregistre un paiement simulé

## Stack

- JavaScript vanilla
- Node.js, HTTP natif
- HTML/CSS/JS pour le front
