import { getState, update } from '../core/store.js';
import { hashPassword, verifyPassword } from '../core/crypto.js';
import { nextId } from '../core/id.js';

const STAFF_PERMISSIONS = new Set([
  'view',
  'manageRooms',
  'manageTenants',
  'manageBills',
  'manageExpenses',
  'manageInvoices',
]);

export function getActiveUser() {
  const { session, users } = getState();
  if (!session?.userId) return null;
  return users.find((user) => String(user.id) === String(session.userId) && user.active) || null;
}

export function isAuthenticated() {
  return Boolean(getActiveUser());
}

export function isOwner() {
  return getActiveUser()?.role === 'owner';
}

/** Central permission check. Owner can do everything. */
export function can(action) {
  const user = getActiveUser();
  if (!user) return false;
  if (user.role === 'owner') return true;
  return STAFF_PERMISSIONS.has(action);
}

export function requireOwner() {
  if (!isOwner()) throw new Error('Aksi ini hanya dapat dilakukan oleh owner.');
}

/**
 * @returns {{ok: true, user: object} | {ok: false, error: string}}
 */
export function login(username, password) {
  const state = getState();
  const normalized = String(username || '').trim().toLowerCase();
  const user = state.users.find((item) => item.username.toLowerCase() === normalized);

  if (!user) return { ok: false, error: 'Username tidak ditemukan.' };
  if (!user.active) return { ok: false, error: 'Akun ini sedang dinonaktifkan. Hubungi owner.' };
  if (!verifyPassword(password, user.passHash)) return { ok: false, error: 'Password salah. Silakan coba lagi.' };

  update((draft) => {
    draft.session = { userId: user.id, issuedAt: new Date().toISOString() };
  });

  return { ok: true, user };
}

export function logout() {
  update((draft) => {
    draft.session = null;
  });
}

function validateUsername(username, users, ignoreId = null) {
  const value = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,20}$/.test(value)) {
    throw new Error('Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.');
  }
  const duplicate = users.some(
    (user) => user.username.toLowerCase() === value && String(user.id) !== String(ignoreId),
  );
  if (duplicate) throw new Error('Username sudah digunakan.');
  return value;
}

function validatePassword(password) {
  if (String(password || '').length < 6) throw new Error('Password minimal 6 karakter.');
  return String(password);
}

export function createUser({ name, username, password, role = 'staff' }) {
  requireOwner();
  const state = getState();
  const cleanName = String(name || '').trim();
  if (!cleanName) throw new Error('Nama lengkap wajib diisi.');
  const cleanUsername = validateUsername(username, state.users);
  validatePassword(password);
  if (!['owner', 'staff'].includes(role)) throw new Error('Role tidak valid.');

  const user = {
    id: nextId(state.users),
    name: cleanName,
    username: cleanUsername,
    passHash: hashPassword(password),
    role,
    active: true,
    createdAt: new Date().toISOString(),
  };

  update((draft) => {
    draft.users.push(user);
  });

  return user;
}

export function updateUser(id, { name, role, active }) {
  requireOwner();
  const state = getState();
  const user = state.users.find((item) => String(item.id) === String(id));
  if (!user) throw new Error('Pengguna tidak ditemukan.');

  if (name !== undefined && !String(name).trim()) throw new Error('Nama lengkap wajib diisi.');
  if (role !== undefined && !['owner', 'staff'].includes(role)) throw new Error('Role tidak valid.');

  const nextRole = role ?? user.role;
  const nextActive = active ?? user.active;

  const removingLastOwner =
    user.role === 'owner' &&
    (nextRole !== 'owner' || nextActive === false) &&
    state.users.filter((item) => item.role === 'owner' && item.active && item.id !== user.id).length === 0;
  if (removingLastOwner) throw new Error('Minimal harus ada satu owner aktif.');

  update((draft) => {
    const target = draft.users.find((item) => String(item.id) === String(id));
    if (name !== undefined) target.name = String(name).trim();
    if (role !== undefined) target.role = role;
    if (active !== undefined) target.active = Boolean(active);
    target.updatedAt = new Date().toISOString();

    if (!target.active && String(draft.session?.userId) === String(target.id)) {
      draft.session = null;
    }
  });

  return getState().users.find((item) => String(item.id) === String(id));
}

export function resetUserPassword(id, password) {
  requireOwner();
  const state = getState();
  const user = state.users.find((item) => String(item.id) === String(id));
  if (!user) throw new Error('Pengguna tidak ditemukan.');
  validatePassword(password);

  update((draft) => {
    const target = draft.users.find((item) => String(item.id) === String(id));
    target.passHash = hashPassword(password);
    target.updatedAt = new Date().toISOString();
  });
}

export function deleteUser(id) {
  requireOwner();
  const state = getState();
  const user = state.users.find((item) => String(item.id) === String(id));
  if (!user) throw new Error('Pengguna tidak ditemukan.');
  if (String(user.id) === String(state.session?.userId)) {
    throw new Error('Anda tidak dapat menghapus akun yang sedang digunakan.');
  }
  if (user.role === 'owner' && state.users.filter((item) => item.role === 'owner' && item.active).length <= 1) {
    throw new Error('Minimal harus ada satu owner aktif.');
  }

  update((draft) => {
    draft.users = draft.users.filter((item) => String(item.id) !== String(id));
  });
}

export function changeOwnPassword(currentPassword, newPassword) {
  const user = getActiveUser();
  if (!user) throw new Error('Sesi tidak valid.');
  if (!verifyPassword(currentPassword, user.passHash)) throw new Error('Password saat ini salah.');
  validatePassword(newPassword);
  update((draft) => {
    const target = draft.users.find((item) => String(item.id) === String(user.id));
    target.passHash = hashPassword(newPassword);
    target.updatedAt = new Date().toISOString();
  });
}
