/* =========================================
   1. SISTEM KONEKSI GLOBAL (SINKRONISASI)
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    console.log("VibeStore System: Connected");

    // A. CEK STATUS LOGIN & TAMPILAN PROFIL
    const savedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    // Update nama di dashboard jika ada
    const profileNameElement = document.querySelector('h4.fw-bold');
    if (savedName && profileNameElement) {
        profileNameElement.innerText = savedName;
    }

    // B. LOGIKA NAVBAR ADAPTIF
    // Jika sudah login, ubah tombol "Masuk" jadi "Akun Saya"
    const loginBtnNav = document.querySelector('.btn-gold[href="auth.html"]');
    if (savedName && loginBtnNav) {
        loginBtnNav.innerText = "Akun Saya";
        loginBtnNav.setAttribute('href', userRole === 'admin' ? 'admin.html' : 'account.html');
    }

    /* =========================================
       2. LOGIKA HALAMAN AUTH (LOGIN & REGIS)
       ========================================= */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const loginBtn = this.querySelector('button');

            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
            loginBtn.disabled = true;

            setTimeout(() => {
                // Simpan Data ke Browser (LocalStorage)
                localStorage.setItem("userName", email.split('@')[0]); // Ambil nama dari email
                
                if (email === "admin@vibe.com") {
                    localStorage.setItem("userRole", "admin");
                    window.location.href = "admin.html";
                } else {
                    localStorage.setItem("userRole", "user");
                    window.location.href = "account.html";
                }
            }, 1200);
        });
    }

    /* =========================================
       3. LOGIKA PRODUK & CHECKOUT (KONEKSI HARGA)
       ========================================= */
    
    // Fungsi pilih produk dari Index/Detail untuk dibawa ke Checkout
    const buyButtons = document.querySelectorAll('.btn-action, .btn-vibe');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Jika tombol 'Ajak Patungan' diklik
            if (this.innerText.includes("Patungan")) {
                localStorage.setItem("checkoutMode", "Patungan");
                localStorage.setItem("checkoutPrice", "300000");
            } else {
                localStorage.setItem("checkoutMode", "Reguler");
                localStorage.setItem("checkoutPrice", "500000");
            }
        });
    });

    // Jalankan logika checkout hanya jika ada di halaman checkout
    if (window.location.pathname.includes('checkout.html')) {
        const mode = localStorage.getItem("checkoutMode") || "Reguler";
        const price = localStorage.getItem("checkoutPrice") || "500000";
        
        const priceElement = document.getElementById('totalAmount');
        if (priceElement) {
            // Update harga awal berdasarkan pilihan dari halaman sebelumnya
            priceElement.innerText = formatRupiah(parseInt(price) + 15000); // Harga + ongkir awal
        }
    }

    /* =========================================
       4. LOGIKA ADMIN (KONTROL)
       ========================================= */
    const adminActionButtons = document.querySelectorAll('.btn-success');
    adminActionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const storeName = this.closest('tr').querySelector('td strong').innerText;
            alert("Toko " + storeName + " telah disetujui untuk berjualan!");
            this.closest('tr').style.opacity = '0.5';
            this.disabled = true;
        });
    });

});

/* =========================================
   5. FUNGSI PEMBANTU (UTILITIES)
   ========================================= */

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

function logout() {
    localStorage.clear();
    alert("Kamu telah keluar.");
    window.location.href = "index.html";
}

// Pasang fungsi logout ke tombol yang ada class 'text-danger'
const logoutBtn = document.querySelector('.text-danger');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}