import { login } from '../services/auth.js';
import { toast } from '../ui/toast.js';
import { brandMark } from '../ui/brand.js';
import { icon } from '../ui/icons.js';
import { esc } from '../ui/dom.js';

const FEATURES = [
  { icon: 'Building2', title: '42 kamar, satu dashboard', desc: 'Okupansi, booking, dan status kamar real-time.' },
  { icon: 'ReceiptText', title: 'Tagihan & verifikasi kas', desc: 'VA, QRIS, dan pengingat WhatsApp dalam satu alur.' },
  { icon: 'Wallet', title: 'Laporan keuangan rapi', desc: 'Accrual, jurnal pengeluaran, dan laba rugi.' },
];

export function renderLogin() {
  return `
    <main class="min-h-dvh flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-4xl card overflow-hidden rounded-3xl shadow-xl animate-in">
        <div class="grid lg:grid-cols-2">
          <div class="bg-brand text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gold/10 blur-2xl"></div>
            <div class="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>

            <div class="relative">
              <div class="flex items-center gap-3">
                ${brandMark('w-12 h-12 rounded-2xl')}
                <div>
                  <p class="font-extrabold tracking-wide text-lg leading-tight">CASA RAMIRE</p>
                  <p class="text-[10px] font-bold text-gold uppercase tracking-[0.22em]">Property Management OS</p>
                </div>
              </div>
              <p class="text-2xl lg:text-3xl font-black mt-8 tracking-tight text-balance">
                Kelola kos Anda dengan tenang.
              </p>
              <p class="text-sm text-stone-300 mt-2 leading-relaxed">
                Dari kamar kosong sampai laporan laba rugi — semua tercatat, rapi, dan siap dipakai.
              </p>
            </div>

            <ul class="relative space-y-3 mt-8">
              ${FEATURES.map(
                (feature) => `
                <li class="flex items-start gap-3">
                  <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">
                    ${icon(feature.icon, 'w-[18px] h-[18px]')}
                  </span>
                  <div>
                    <p class="text-[13px] font-bold">${esc(feature.title)}</p>
                    <p class="text-[11px] text-stone-400 leading-snug">${esc(feature.desc)}</p>
                  </div>
                </li>`,
              ).join('')}
            </ul>

            <p class="relative text-[10px] text-stone-300 mt-8">
              © ${new Date().getFullYear()} Casa Ramire · Data tersimpan di perangkat ini
            </p>
          </div>

          <div class="p-7 sm:p-10 bg-white">
            <div class="mb-6">
              <span class="badge-gold">Masuk ke sistem</span>
              <h1 class="text-2xl font-black text-stone-800 mt-3 tracking-tight">Selamat datang kembali 👋</h1>
              <p class="text-sm text-stone-600 mt-1">Gunakan akun yang diberikan owner untuk melanjutkan.</p>
            </div>

            <form id="login-form" class="space-y-4" novalidate>
              <div>
                <label class="label" for="login-username">Username</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${icon('UserRound', 'w-4 h-4')}</span>
                  <input id="login-username" name="username" type="text" class="input pl-9" placeholder="cth: owner" autocomplete="username" required />
                </div>
              </div>

              <div>
                <label class="label" for="login-password">Password</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${icon('Lock', 'w-4 h-4')}</span>
                  <input id="login-password" name="password" type="password" class="input pl-9 pr-11" placeholder="••••••••" autocomplete="current-password" required />
                  <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100" data-toggle-password aria-label="Tampilkan password">
                    ${icon('Eye', 'w-4 h-4')}
                  </button>
                </div>
              </div>

              <div id="login-error" class="hidden items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
                ${icon('CircleAlert', 'w-4 h-4 shrink-0 mt-0.5')}
                <span data-error-text></span>
              </div>

              <button type="submit" class="btn-primary w-full py-3" data-submit>
                ${icon('LogIn', 'w-4 h-4')}
                <span>Masuk ke sistem</span>
              </button>
            </form>

            <div class="mt-6 rounded-2xl border border-line bg-cream/60 p-4">
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">Akun demo</p>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button type="button" class="btn-outline btn-sm justify-start" data-demo="owner">
                  ${icon('ShieldCheck', 'w-4 h-4 text-brand')}
                  <span class="text-left leading-tight">Owner<br><span class="text-[10px] font-semibold text-stone-600">owner / 123456</span></span>
                </button>
                <button type="button" class="btn-outline btn-sm justify-start" data-demo="staff">
                  ${icon('UserRound', 'w-4 h-4 text-brand')}
                  <span class="text-left leading-tight">Staf<br><span class="text-[10px] font-semibold text-stone-600">rian / 123456</span></span>
                </button>
              </div>
              <p class="hint mt-2">Klik kartu untuk mengisi otomatis, lalu tekan Masuk.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function bindLogin(root) {
  const form = root.querySelector('#login-form');
  const usernameInput = root.querySelector('#login-username');
  const passwordInput = root.querySelector('#login-password');
  const errorBox = root.querySelector('#login-error');
  const errorText = root.querySelector('[data-error-text]');
  const submit = root.querySelector('[data-submit]');

  const showError = (message) => {
    errorText.textContent = message;
    errorBox.classList.remove('hidden');
    errorBox.classList.add('flex');
  };

  const hideError = () => {
    errorBox.classList.add('hidden');
    errorBox.classList.remove('flex');
  };

  root.querySelector('[data-toggle-password]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    button.innerHTML = icon(isHidden ? 'EyeOff' : 'Eye', 'w-4 h-4');
    button.setAttribute('aria-label', isHidden ? 'Sembunyikan password' : 'Tampilkan password');
  });

  root.querySelectorAll('[data-demo]').forEach((button) => {
    button.addEventListener('click', () => {
      const isOwner = button.dataset.demo === 'owner';
      usernameInput.value = isOwner ? 'owner' : 'rian';
      passwordInput.value = '123456';
      hideError();
      passwordInput.focus();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      showError('Username dan password wajib diisi.');
      return;
    }

    submit.disabled = true;
    submit.innerHTML = `${icon('Loader2', 'w-4 h-4 animate-spin')}<span>Memeriksa…</span>`;

    const result = login(username, password);
    if (!result.ok) {
      submit.disabled = false;
      submit.innerHTML = `${icon('LogIn', 'w-4 h-4')}<span>Masuk ke sistem</span>`;
      showError(result.error);
      passwordInput.select();
      return;
    }

    toast(`Selamat datang, ${result.user.name.split(' ')[0]}!`);
    // The store subscription in main.js swaps the screen.
  });
}
