// ===== Configuration =====
const API_BASE = window.location.origin; // e.g. http://localhost:3000

// ===== DOM Elements =====
const form = document.getElementById('paymentForm');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');
const healthBadge = document.getElementById('healthBadge');
const healthText = document.getElementById('healthText');

// ===== Health Check =====
async function checkHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`);
        if (!res.ok) throw new Error();
        healthBadge.className = 'health-badge online';
        healthText.textContent = 'Backend Online';
    } catch {
        healthBadge.className = 'health-badge offline';
        healthText.textContent = 'Backend Offline';
    }
}

// Check immediately, then every 30 seconds
checkHealth();
setInterval(checkHealth, 30000);

// ===== Form Submit =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('amount').value.trim();
    const currency = document.getElementById('currency').value;
    const description = document.getElementById('description').value.trim();

    // Client-side validation
    if (!amount || Number(amount) <= 0) {
        showResult('error', '<strong>Validation Error</strong><br>Amount must be a positive number.');
        return;
    }

    // Disable button & show spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing…';
    hideResult();

    try {
        const res = await fetch(`${API_BASE}/api/v1/payments/intents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Number(amount),
                currency,
                description: description || undefined,
            }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.error || `Server returned ${res.status}`);
        }

        const d = data.data;
        showResult('success', `
      <div class="row"><span class="label">Payment ID</span></div>
      <div class="value">${d.id}</div>
      <br/>
      <div class="row"><span class="label">Client Secret</span></div>
      <div class="value">${d.client_secret}</div>
      <br/>
      <div class="row">
        <span class="label">Amount</span>
        <span>${formatAmount(d.amount, currency)}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="status-chip">${d.status}</span>
      </div>
    `);

        // Reset form on success
        form.reset();
    } catch (err) {
        showResult('error', `<strong>Error</strong><br>${escapeHtml(err.message)}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Payment Intent';
    }
});

// ===== Helpers =====

function showResult(type, html) {
    resultDiv.className = `result visible ${type}`;
    resultDiv.innerHTML = html;
}

function hideResult() {
    resultDiv.className = 'result';
    resultDiv.innerHTML = '';
}

function formatAmount(cents, currency) {
    const num = Number(cents);
    const dollars = (num / 100).toFixed(2);
    return `${dollars} ${currency}`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
