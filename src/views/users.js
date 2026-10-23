import { formatDate, formatDateTime } from '../core/format.js';
import { getState } from '../core/store.js';
import {
  createUser,
  deleteUser,
  getActiveUser,
  isOwner,
  resetUserPassword,
  updateUser,
} from '../services/auth.js';
import {
  avatar,
  emptyState,
  pageHeader,
  statCard,
} from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

function roleBadge(role) {
  return role === 'owner'
    ? '<span class="badge-gold">Owner</span>'
    : '<span class="badge-blue">Staff</span>';
}

export function render(root) {
  if (!isOwner()) {
    root.innerHTML = `
      <div class="card animate-in">
        ${emptyState({
          iconName: 'Lock',
          title: 'Akses terbatas',
          description: 'Halaman manajemen akun hanya dapat diakses oleh owner.',
          action: `<a href="#/dashboard" class="btn-primary btn-sm">${icon('LayoutDashboard', 'w-4 h-4')} Kembali ke Dashboard</a>`,
        })}
      </div>
    `;
    return;
  }

  const users = [...getState().users].sort((a, b) => a.name.localeCompare(b.name, 'id'));
  const currentUser = getActiveUser();
  const activeUsers = users.filter((user) => user.active);
  const owners = users.filter((user) => user.role === 'owner');
  const staff = users.filter((user) => user.role === 'staff');

  root.innerHTML = `
    <div data-view="users" class="animate-in">
      ${pageHeader({
        eyebrow: 'Access Control',
        title: 'Manajemen Akun 🔐',
        subtitle: 'Kelola akses owner dan staf operasional. Setiap perubahan langsung berlaku.',
        actions: `<button type="button" class="btn-primary btn-sm" data-action="add-user">${icon('UserPlus', 'w-4 h-4')} Tambah Akun</button>`,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${statCard({ label: 'Total Akun', value: users.length, iconName: 'Users' })}
        ${statCard({ label: 'Akun Aktif', value: activeUsers.length, iconName: 'UserCheck', tone: 'green' })}
        ${statCard({ label: 'Owner', value: owners.length, iconName: 'ShieldCheck', tone: 'brand' })}
        ${statCard({ label: 'Staf', value: staff.length, iconName: 'UserRound', tone: 'indigo' })}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h3 class="font-extrabold text-stone-800 text-sm">Daftar Pengguna</h3>
            <p class="text-xs text-stone-500 mt-0.5">Owner dapat mengelola semua akun; staf hanya akses operasional.</p>
          </div>
          <span class="badge-gray">${activeUsers.length} aktif</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Role</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${
                users.length
                  ? users
                      .map((user) => {
                        const isSelf = String(user.id) === String(currentUser?.id);
                        return `
                        <tr>
                          <td>
                            <div class="flex items-center gap-2.5">
                              ${avatar(user.name, 'w-9 h-9 text-[10px]')}
                              <div class="min-w-0">
                                <p class="font-bold text-stone-800 flex items-center gap-1.5">
                                  ${esc(user.name)}
                                  ${isSelf ? '<span class="badge-gray">Anda</span>' : ''}
                                </p>
                                <p class="text-[10px] text-stone-400 font-mono">@${esc(user.username)}</p>
                              </div>
                            </div>
                          </td>
                          <td>${roleBadge(user.role)}</td>
                          <td>
                            ${
                              user.active
                                ? '<span class="badge-green">Aktif</span>'
                                : '<span class="badge-red">Nonaktif</span>'
                            }
                          </td>
                          <td class="whitespace-nowrap text-xs text-stone-500">${formatDate(user.createdAt)}</td>
                          <td>
                            <div class="flex flex-wrap items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="edit-user" data-id="${user.id}">${icon('Pencil', 'w-3 h-3')} Edit</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="reset-password" data-id="${user.id}" title="Reset password">${icon('KeyRound', 'w-3.5 h-3.5')}</button>
                              <button type="button" class="btn-ghost btn-xs ${user.active ? 'text-amber-700' : 'text-emerald-700'}" data-action="toggle-active" data-id="${user.id}" title="${user.active ? 'Nonaktifkan akun' : 'Aktifkan akun'}" ${isSelf ? 'disabled' : ''}>
                                ${icon(user.active ? 'Lock' : 'Unlock', 'w-3.5 h-3.5')}
                              </button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-user" data-id="${user.id}" title="Hapus akun" ${isSelf ? 'disabled' : ''}>${icon('Trash2', 'w-3.5 h-3.5')}</button>
                            </div>
                          </td>
                        </tr>`;
                      })
                      .join('')
                  : `<tr><td colspan="5" class="px-4 py-10 text-center text-stone-400 text-sm">Belum ada akun.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>

      <p class="hint mt-3 flex items-center gap-1.5">
        ${icon('Info', 'w-3.5 h-3.5')}
        Password disimpan dalam bentuk hash SHA-256 bersalt di perangkat ini, bukan teks asli.
      </p>
    </div>
  `;

  const scope = root.querySelector('[data-view="users"]');

  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    const user = users.find((item) => String(item.id) === String(id));

    if (action === 'add-user') {
      openUserModal();
      return;
    }

    if (!user) return;

    if (action === 'edit-user') {
      openUserModal(user);
      return;
    }

    if (action === 'reset-password') {
      openResetPasswordModal(user);
      return;
    }

    if (action === 'toggle-active') {
      if (user.active) {
        const approved = await confirmAction({
          title: 'Nonaktifkan akun?',
          message: `<b>${esc(user.name)}</b> tidak akan bisa masuk sampai akun diaktifkan kembali.`,
          confirmText: 'Ya, nonaktifkan',
          danger: true,
        });
        if (!approved) return;
      }
      try {
        updateUser(user.id, { active: !user.active });
        toast(user.active ? 'Akun dinonaktifkan.' : 'Akun diaktifkan kembali.');
      } catch (error) {
        toast(error.message, 'error');
      }
      return;
    }

    if (action === 'delete-user') {
      const approved = await confirmAction({
        title: 'Hapus akun?',
        message: `<b>${esc(user.name)}</b> (@${esc(user.username)}) akan dihapus permanen dan tidak dapat masuk lagi.`,
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      try {
        deleteUser(user.id);
        toast('Akun berhasil dihapus.');
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  });
}

function openUserModal(user = null) {
  const isEdit = Boolean(user);

  openModal({
    title: isEdit ? 'Edit Akun' : 'Tambah Akun Baru',
    subtitle: isEdit ? `@${user.username}` : 'Akun baru dapat langsung digunakan setelah disimpan.',
    size: 'md',
    body: `
      <form id="user-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="usr-name">Nama lengkap</label>
          <input id="usr-name" type="text" class="input" placeholder="cth: Rian Pratama" value="${esc(user?.name || '')}" required />
        </div>
        <div>
          <label class="label" for="usr-username">Username</label>
          <input id="usr-username" type="text" class="input font-mono" placeholder="cth: rian" value="${esc(user?.username || '')}" ${isEdit ? 'disabled' : ''} required />
          <p class="hint mt-1">${isEdit ? 'Username tidak dapat diubah.' : '3–20 karakter: huruf, angka, titik, garis bawah, atau strip.'}</p>
        </div>
        ${
          isEdit
            ? ''
            : `<div>
                <label class="label" for="usr-password">Password awal</label>
                <input id="usr-password" type="password" class="input" placeholder="Minimal 6 karakter" autocomplete="new-password" required />
              </div>`
        }
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="usr-role">Role</label>
            <select id="usr-role" class="select">
              <option value="staff" ${user?.role !== 'owner' ? 'selected' : ''}>Staf Operasional</option>
              <option value="owner" ${user?.role === 'owner' ? 'selected' : ''}>Owner / Super Admin</option>
            </select>
          </div>
          ${
            isEdit
              ? `<div class="flex items-end pb-2.5">
                  <label class="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                    <input id="usr-active" type="checkbox" class="w-4 h-4 rounded border-stone-300 accent-brand" ${user.active ? 'checked' : ''} />
                    Akun aktif
                  </label>
                </div>`
              : ''
          }
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="user-form" class="btn-primary btn-sm">${icon('Check', 'w-4 h-4')} ${isEdit ? 'Simpan perubahan' : 'Buat akun'}</button>
    `,
    onMount(el, close) {
      el.querySelector('#user-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          if (isEdit) {
            updateUser(user.id, {
              name: el.querySelector('#usr-name').value,
              role: el.querySelector('#usr-role').value,
              active: el.querySelector('#usr-active').checked,
            });
            toast('Akun berhasil diperbarui.');
          } else {
            createUser({
              name: el.querySelector('#usr-name').value,
              username: el.querySelector('#usr-username').value,
              password: el.querySelector('#usr-password').value,
              role: el.querySelector('#usr-role').value,
            });
            toast('Akun baru berhasil dibuat.');
          }
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function openResetPasswordModal(user) {
  openModal({
    title: 'Reset Password',
    subtitle: `${user.name} · @${user.username}`,
    size: 'sm',
    body: `
      <form id="reset-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="rst-password">Password baru</label>
          <input id="rst-password" type="password" class="input" placeholder="Minimal 6 karakter" autocomplete="new-password" required />
        </div>
        <div>
          <label class="label" for="rst-confirm">Konfirmasi password</label>
          <input id="rst-confirm" type="password" class="input" autocomplete="new-password" required />
        </div>
        <p class="hint">Terakhir diperbarui: ${formatDateTime(user.updatedAt || user.createdAt)}. Sampaikan password baru secara aman kepada pengguna.</p>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="reset-form" class="btn-primary btn-sm">${icon('KeyRound', 'w-4 h-4')} Reset password</button>
    `,
    onMount(el, close) {
      el.querySelector('#reset-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const password = el.querySelector('#rst-password').value;
        const confirmation = el.querySelector('#rst-confirm').value;
        if (password !== confirmation) {
          toast('Konfirmasi password tidak cocok.', 'error');
          return;
        }
        try {
          resetUserPassword(user.id, password);
          toast('Password berhasil direset.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
