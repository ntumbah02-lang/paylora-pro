const formatMoney = (value) => `${Number(value).toLocaleString('fr-FR')} FC`;

const api = {
  async getSummary() {
    const response = await fetch('/api/summary');
    if (!response.ok) throw new Error('Impossible de récupérer le résumé');
    return response.json();
  },

  async createPayment(payload) {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur de paiement');
    return data;
  },
};

function statusClass(status) {
  if (status === 'Succès') return 'status-success';
  if (status === 'En attente') return 'status-pending';
  return 'status-error';
}

function renderTransactions(transactions) {
  const tbody = document.querySelector('#transactionsTable');
  tbody.innerHTML = transactions.map((item) => `
    <tr>
      <td>${item.id}</td>
      <td>${item.customer}</td>
      <td>${formatMoney(item.amount)}</td>
      <td><span class="status-pill ${statusClass(item.status)}">${item.status}</span></td>
      <td>${item.channel}</td>
    </tr>
  `).join('');
}

async function refreshDashboard() {
  const data = await api.getSummary();
  document.querySelector('#totalVolume').textContent = formatMoney(data.metrics.totalVolume);
  document.querySelector('#successRate').textContent = `${data.metrics.successRate}%`;
  document.querySelector('#activeMerchants').textContent = data.metrics.activeMerchants;
  document.querySelector('#pendingPayouts').textContent = formatMoney(data.metrics.pendingPayouts);
  renderTransactions(data.transactions.slice(0, 8));
}

document.querySelector('#paymentForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    customer: document.querySelector('#customer').value,
    amount: Number(document.querySelector('#amount').value),
    channel: document.querySelector('#channel').value,
  };

  const message = document.querySelector('#formMessage');
  message.textContent = 'Traitement en cours...';

  try {
    await api.createPayment(payload);
    message.textContent = 'Paiement traité avec succès.';
    form.reset();
    await refreshDashboard();
  } catch (error) {
    message.textContent = error.message;
  }
});

refreshDashboard();
