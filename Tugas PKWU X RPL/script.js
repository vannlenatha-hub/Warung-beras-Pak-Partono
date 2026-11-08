let cart = [];
let selectedProduct = null;

// Buka modal saat produk diklik
function openProductModal(name, price, img) {
  selectedProduct = { name, price, img };
  document.getElementById('modal-title').innerText = name;
  document.getElementById('modal-desc').innerText = `Harga: Rp ${price.toLocaleString('id-ID')} / liter`;
  document.getElementById('modal-qty').value = 1;
  document.getElementById('product-modal').style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('product-modal').style.display = 'none';
  selectedProduct = null;
}

// Tambah produk ke keranjang
function confirmAddToCart() {
  const qty = parseInt(document.getElementById('modal-qty').value);
  if (qty <= 0 || isNaN(qty)) {
    alert("Masukkan jumlah liter yang valid!");
    return;
  }

  const existingIndex = cart.findIndex(item => item.name === selectedProduct.name);
  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({ ...selectedProduct, qty });
  }

  updateCartUI();
  closeProductModal();
  toggleCart(true);
}

// Buka/Tutup Sidebar Cart
function toggleCart(forceOpen = false) {
  const sidebar = document.getElementById('cart-sidebar');
  if (forceOpen) {
    sidebar.classList.add('open');
  } else {
    sidebar.classList.toggle('open');
  }
}

// Update Tampilan Cart
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotal = document.getElementById('cart-total');

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Keranjang masih kosong.</p>';
  } else {
    cart.forEach((item, index) => {
      const itemSubtotal = item.price * item.qty;
      total += itemSubtotal;

      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.qty} liter x Rp ${item.price.toLocaleString('id-ID')}</small>
          </div>
          <div>
            <span>Rp ${itemSubtotal.toLocaleString('id-ID')}</span>
            <button onclick="removeItem(${index})" style="background:none;border:none;color:red;cursor:pointer;margin-left:5px;font-weight:bold;">&times;</button>
          </div>
        </div>
      `;
    });
  }

  cartBadge.innerText = cart.length;
  cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Kirim Pesanan ke WhatsApp
function sendToWhatsApp() {
  const name = document.getElementById('buyer-name').value.trim();
  const phone = document.getElementById('buyer-phone').value.trim();
  const payment = document.getElementById('payment-method').value.trim();

  if (!name || !phone || !payment) {
    alert("Harap isi Nama, Nomor HP, dan Metode Pembayaran terlebih dahulu!");
    return;
  }

  if (cart.length === 0) {
    alert("Keranjang kamu masih kosong!");
    return;
  }

  let total = 0;
  let itemText = "";

  cart.forEach((item, i) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    itemText += `${i + 1}. ${item.name} (${item.qty} liter) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
  });

  const message = `Halo Pak Partono, saya mau pesan beras:\n\n` +
    `*DATA PEMBELI*\n` +
    ` Nama: ${name}\n` +
    ` No HP: ${phone}\n` +
    ` Pembayaran: ${payment}\n\n` +
    `*PESANAN*\n` +
    `${itemText}\n` +
    `*TOTAL HARGA:* Rp ${total.toLocaleString('id-ID')}`;

  // Nomor WA Pak Partono yang baru
  const waNumber = "6281219475514"; 
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  window.open(waUrl, '_blank');
}