/* =========================================
   1. SISTEM KONEKSI GLOBAL (SINKRONISASI)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    console.log("VibeStore System: Fully Activated 🚀");

    // A. CEK STATUS LOGIN & UPDATE UI
    const savedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    // Update Nama di Dashboard (User & Admin)
    const profileNameElement = document.querySelector('h4.fw-bold');
    const adminDisplay = document.getElementById('adminNameDisplay');
    
    if (savedName) {
        if (profileNameElement) profileNameElement.innerText = savedName;
        if (adminDisplay) adminDisplay.innerText = "Halo, " + savedName;

        // Ubah Tombol "Masuk" di Navbar PC jadi "Akun"
        const loginBtnNav = document.querySelector('.btn-gold');
        if (loginBtnNav && loginBtnNav.innerText === "Masuk") {
            loginBtnNav.innerText = "Akun Saya";
            loginBtnNav.setAttribute('onclick', 'goToAccount()');
        }
    }

    /* =========================================
       2. LOGIKA AUTH (LOGIN & REDIRECT)
       ========================================= */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const loginBtn = this.querySelector('button');

            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';
            loginBtn.disabled = true;

            setTimeout(() => {
                const name = email.split('@')[0].toUpperCase();
                localStorage.setItem("userName", name);
                
                if (email === "admin@vibe.com") {
                    localStorage.setItem("userRole", "admin");
                    window.location.href = "admin.html";
                } else {
                    localStorage.setItem("userRole", "user");
                    window.location.href = "account.html";
                }
            }, 1000);
        });
    }

    /* =========================================
       3. LOGIKA HARGA PINTAR (PATUNGAN)
       ========================================= */
    const priceElement = document.getElementById('totalAmount');
    if (window.location.pathname.includes('checkout.html') && priceElement) {
        const mode = localStorage.getItem("checkoutMode") || "Reguler";
        const basePrice = (mode === "Patungan") ? 300000 : 500000;
        priceElement.innerText = formatRupiah(basePrice + 15000); // Harga + Ongkir
    }
});

/* =========================================
   4. FUNGSI ACTION (BISA DIPANGGIL DI MANA SAJA)
   ========================================= */

// Fungsi Navigasi Pintar (Cegah Login Ulang)
function goToAccount() {
    const savedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (savedName) {
        window.location.href = (userRole === "admin") ? "admin.html" : "account.html";
    } else {
        window.location.href = "auth.html";
    }
}

// Simulasi Nego AI
function startNego() {
    const input = document.getElementById('negoInput');
    const responseDiv = document.getElementById('negoResponse');
    if (!input || !input.value) return;

    responseDiv.innerHTML = "🤖 AI sedang menghitung risiko...";
    setTimeout(() => {
        const tawaran = parseInt(input.value);
        if (tawaran < 250000) {
            responseDiv.innerHTML = "🤖 <span class='text-danger'>Aduh, kemurahan! Naikin dikit lagi bos.</span>";
        } else {
            responseDiv.innerHTML = "🤖 <span class='text-success'>Oke Deal! Pakai kode 'VIBEAI' saat checkout.</span>";
        }
    }, 1000);
}

// Fungsi Simpan Mode Patungan
function setCheckoutMode(mode, price) {
    localStorage.setItem("checkoutMode", mode);
    localStorage.setItem("checkoutPrice", price);
    window.location.href = "checkout.html";
}

// Fungsi Logout
function logout() {
    if (confirm("Keluar dari VibeStore?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

// Utility Format Uang
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

/* =========================================
   5. LOGIKA KHUSUS ADMIN (VERIFIKASI & USER)
   ========================================= */

// A. Fungsi Verifikasi Toko (Setuju/Tolak)
function handleStore(rowId, storeName, status) {
    if (confirm(`Apakah Anda yakin toko ${storeName} ini ${status}?`)) {
        const row = document.getElementById(rowId);
        if (row) {
            row.style.transition = "0.5s";
            row.style.opacity = "0";
            row.style.transform = "translateX(20px)";
            
            setTimeout(() => {
                row.remove();
                alert(`Toko ${storeName} telah ${status}.`);
                
                // Update angka pending di dashboard
                const countEl = document.getElementById('countPending');
                if(countEl) {
                    let current = parseInt(countEl.innerText);
                    countEl.innerText = current > 0 ? current - 1 : 0;
                }
            }, 500);
        }
    }
}

// B. Fungsi User Management (Ban User)
function banUser(rowId, name) {
    if (confirm(`Blokir user ${name}? User ini tidak akan bisa login kembali.`)) {
        const row = document.getElementById(rowId);
        if (row) {
            row.innerHTML = `<td colspan="3" class="text-center bg-light text-muted small py-3">
                                <i class="bi bi-shield-slash me-1"></i> User ${name} telah diblokir permanen
                             </td>`;
            row.style.backgroundColor = "#fff5f5";
        }
    }
}

// C. Sistem Keamanan (Security Guard)
// Mencegah user biasa masuk ke admin.html via URL
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        const role = localStorage.getItem("userRole");
        if (role !== 'admin') {
            alert("⚠️ AKSES DITOLAK! Anda bukan admin.");
            window.location.href = "auth.html";
        }
    }
});