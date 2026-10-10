const cart = new Map();
const body = document.body;
const panel = document.getElementById('cart-panel');
const overlay = document.getElementById('cart-overlay');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderCart() {
  const count = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
  const items = document.getElementById('cart-items');
  if (!cart.size) {
    items.innerHTML = '<p class="empty-cart">Пока пусто — выбери свой формат пляжа.</p>';
    return;
  }
  items.innerHTML = [...cart.entries()].map(([name, item]) => `
    <div class="cart-row"><div>${name}<small>Количество: ${item.quantity} · цена уточняется</small></div>
    <button class="remove-item" data-remove="${name}" aria-label="Удалить ${name}">×</button></div>`).join('');
  items.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
    cart.delete(button.dataset.remove);
    renderCart();
  }));
}

function setCartOpen(open) {
  body.classList.toggle('cart-open', open);
  panel.setAttribute('aria-hidden', String(!open));
  if (open) document.getElementById('cart-close').focus();
}

document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.product;
  const item = cart.get(name) || { quantity: 0 };
  item.quantity += 1;
  cart.set(name, item);
  renderCart();
  showToast('Добавлено в демо-корзину');
}));

document.getElementById('cart-open').addEventListener('click', () => setCartOpen(true));
document.getElementById('cart-close').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setCartOpen(false); });
document.getElementById('checkout').addEventListener('click', () => showToast('Демо-режим: оформление заказа не подключено'));
