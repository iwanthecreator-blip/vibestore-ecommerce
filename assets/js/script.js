/* =========================================
   1. SISTEM KONEKSI GLOBAL (SINKRONISASI)
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    console.log("VibeStore System: Connected");

    // A. CEK STATUS LOGIN
    const savedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    // B. UPDATE NAMA DI DASHBOARD
    // Kode ini akan mencari elemen nama di account.html atau admin.html
    const profileNameElement = document.querySelector('h4.fw-bold');
    if (savedName && profileNameElement) {
        profileNameElement.innerText = savedName;
    }

    // C. LOGIKA NAVBAR ADAPTIF (PC)
    const loginBtnNav = document.querySelector('.btn-gold[href="auth.html"]');
    if (savedName && loginBtnNav) {
        loginBtnNav.innerText = "Akun Saya";
        // Jika diklik, jalankan fungsi goToAccount bukannya ke auth.html
        loginBtnNav.setAttribute('href', 'javascript:void(0)');
        loginBtnNav.setAttribute('onclick', 'goToAccount()');
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
                // Simpan nama (ambil teks sebelum @ di email)
                const nameToSave = email.split('@')[0];
                localStorage.setItem("userName", nameToSave);
                
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
       3. LOGIKA PRODUK & CHECKOUT
       ========================================= */
    const buyButtons = document.querySelectorAll('.card-product a, .btn-vibe');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.innerText.includes("PATUNGAN")) {
                localStorage.setItem("checkoutMode", "Patungan");
                localStorage.setItem("checkoutPrice", "300000");
            } else {
                localStorage.setItem("checkoutMode", "Reguler");
                localStorage.setItem("checkoutPrice", "500000");
            }
        });
    });

    if (window.location.pathname.includes('checkout.html')) {
        const price = localStorage.getItem("checkoutPrice") || "500000";
        const priceElement = document.getElementById('totalAmount');
        if (priceElement) {
            priceElement.innerText = formatRupiah(parseInt(price) + 15000);
        }
    }
});

/* =========================================
   4. FUNGSI NAVIGASI PINTAR (LINK SEMUA HALAMAN)
   ========================================= */

// Fungsi ini yang membuat tombol Akun di HP dan PC "Cerdas"
function goToAccount() {
    const savedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (savedName) {
        // Jika sudah login, lempar ke dashboard yang sesuai
        if (userRole === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "account.html";
        }
    } else {
        // Jika belum login, lempar ke halaman auth
        window.location.href = "auth.html";
    }
}

function logout() {
    if (confirm("Apakah anda yakin ingin keluar?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}