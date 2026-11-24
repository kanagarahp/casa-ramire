import { getState, update } from '../core/store.js';
import { hashPassword, verifyPassword } from '../core/crypto.js';
import { nextId } from '../core/id.js';
import { storage } from '../core/storage.js';
import { toast } from '../ui/toast.js';

const AUTH_KEY = 'casa-ramire:auth';
const STAFF_PERMISSIONS = new Set([
  'view',
  'manageRooms',
  'manageTenants',
  'manageBills',
  'manageExpenses',
  'manageInvoices',
]);

let bootstrapPromise = null;
let bootstrapDone = false;

function readAuthSession() {
  const value = storage.get(AUTH_KEY);
  if (!value || typeof value !== 'object' || !value.token || !value.user) return null;
  if (value.expiresAt && Date.parse(value.expiresAt) < Date.now()) {
    storage.remove(AUTH_KEY);
    return null;
  }
  return value;
}

export function getAuthToken() {
  return readAuthSession()?.token || '';
}

function adminKey() {
  return String(getState().settings?.catalogAdminKey || '').trim();
}

/** True when this device can call protected APIs (login token or legacy key). */
export function hasApiAuth() {
  return Boolean(getAuthToken() || adminKey());
}

/** Headers for protected API routes: token first, legacy admin key second. */
export function getApiAuthHeaders(extra = {}) {
  const token = getAuthToken();
  if (token) return { ...extra, Authorization: `Bearer ${token}` };
  const key = adminKey();
  return key ? { ...extra, 'x-admin-key': key } : { ...extra };
}

export function getActiveUser() {
  const { session, users } = getState();
  if (session?.userId) {
    const hasRemoteSession = session.remote === true;
    const tokenAlive = hasRemoteSession ? Boolean(getAuthToken()) : true;
    if (tokenAlive) {
      const user = (users || []).find(
        (item) => String(item.id) === String(session.userId),
      );
      if (user) return user.active === false ? null : user;
    }
  }

  const auth = readAuthSession();
  if (auth?.user && auth.user.active !== false) return auth.user;
  return null;
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

async function readJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return {};
  return response.json().catch(() => ({}));
}

/** Returns null when the API is unreachable, so callers can fall back. */
async function apiFetch(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    return null;
  }
  return { response, payload: await readJson(response) };
}

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function validateUsername(username, users, ignoreId = null) {
  const value = normalizeUsername(username);
  if (!/^[a-z0-9._-]{3,20}$/.test(value)) {
    throw new Error('Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.');
  }
  const duplicate = (users || []).some(
    (user) =>
      String(user.username).toLowerCase() === value &&
      String(user.id) !== String(ignoreId),
  );
  if (duplicate) throw new Error('Username sudah digunakan.');
  return value;
}

function validatePassword(password) {
  if (String(password || '').length < 6) throw new Error('Password minimal 6 karakter.');
  return String(password);
}

function storeRemoteLogin(result, password = '') {
  const user = {
    id: String(result.user.id),
    name: result.user.name,
    username: result.user.username,
    role: result.user.role,
    active: result.user.active !== false,
    createdAt: result.user.createdAt || new Date().toISOString(),
    updatedAt: result.user.updatedAt || '',
    passHash: password ? hashPassword(password) : '',
  };

  storage.set(AUTH_KEY, {
    token: result.token,
    expiresAt: result.expiresAt,
    user,
  });

  update(
    (draft) => {
      draft.users = Array.isArray(draft.users) ? draft.users : [];
      const index = draft.users.findIndex(
        (item) => String(item.username).toLowerCase() === String(user.username).toLowerCase(),
      );
      if (index >= 0) {
        draft.users[index] = {
          ...draft.users[index],
          ...user,
          passHash: user.passHash || draft.users[index].passHash || '',
        };
      } else {
        draft.users.push(user);
      }
      draft.session = {
        userId: user.id,
        issuedAt: new Date().toISOString(),
        remote: true,
      };
    },
    { touchMeta: false },
  );

  return getState().users.find((item) => String(item.id) === String(user.id)) || user;
}

function loginLocal(username, password) {
  const state = getState();
  const normalized = normalizeUsername(username);
  const user = state.users.find((item) => item.username.toLowerCase() === normalized);

  if (!user) return { ok: false, error: 'Username tidak ditemukan di perangkat ini.' };
  if (user.active === false) {
    return { ok: false, error: 'Akun ini sedang dinonaktifkan. Hubungi owner.' };
  }
  if (!verifyPassword(password, user.passHash)) {
    return { ok: false, error: 'Password salah. Silakan coba lagi.' };
  }

  update(
    (draft) => {
      draft.session = {
        userId: user.id,
        issuedAt: new Date().toISOString(),
        remote: false,
      };
    },
    { touchMeta: false },
  );

  return { ok: true, user, remote: false };
}

async function remoteLogin(username, password) {
  let response;
  try {
    response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return {
      ok: false,
      fatal: false,
      warning: 'Server tidak dapat dihubungi. Login memakai akun perangkat ini.',
    };
  }

  const payload = await readJson(response);

  if (response.ok && payload?.token && payload?.user) {
    return { ok: true, token: payload.token, expiresAt: payload.expiresAt, user: payload.user };
  }

  if (response.status === 409 && payload?.code === 'ACCOUNTS_NOT_READY') {
    return { ok: false, fatal: false, warning: payload.error };
  }

  if (response.status === 401 || response.status === 403) {
    return {
      ok: false,
      fatal: true,
      error: payload?.error || 'Username atau password salah.',
    };
  }

  return {
    ok: false,
    fatal: false,
    warning: payload?.error || 'Login server gagal. Memakai akun perangkat ini.',
  };
}

/**
 * Seed the server account table from this device's local users. Only owners
 * with the legacy admin key can do this; existing server accounts are never
 * overwritten.
 */
export async function bootstrapAccounts() {
  if (!adminKey()) return false;
  if (bootstrapDone) return true;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const users = (getState().users || []).map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        active: user.active !== false,
        passHash: user.passHash,
        createdAt: user.createdAt,
      }));

      const response = await fetch('/api/auth/bootstrap', {
        method: 'POST',
        headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ users }),
      });
      if (!response.ok) return false;
      const payload = await readJson(response);
      bootstrapDone = true;
      if (Number(payload?.created) > 0) {
        toast(
          `Akun server disiapkan (${payload.created}). Perangkat lain sekarang bisa login.`,
          'success',
        );
      }
      return true;
    } catch {
      return false;
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}

/** Refresh the local user directory from the server (used by Manajemen Akun). */
export async function loadRemoteUsers() {
  if (!getAuthToken()) return null;

  try {
    const response = await fetch('/api/auth/users', {
      headers: getApiAuthHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const payload = await readJson(response);
    const users = Array.isArray(payload?.users) ? payload.users : [];
    if (!users.length) return null;

    const current = getState().users || [];
    const unchanged =
      current.length === users.length &&
      users.every((user) => {
        const existing = current.find(
          (item) => String(item.id) === String(user.id),
        );
        return (
          existing &&
          existing.name === user.name &&
          existing.username === user.username &&
          existing.role === user.role &&
          existing.active === user.active
        );
      });
    if (unchanged) return users;

    update(
      (draft) => {
        const hashes = new Map(
          (draft.users || []).map((user) => [
            String(user.username).toLowerCase(),
            user.passHash || '',
          ]),
        );
        draft.users = users.map((user) => ({
          ...user,
          passHash: hashes.get(String(user.username).toLowerCase()) || '',
        }));
      },
      { touchMeta: false },
    );

    return users;
  } catch {
    return null;
  }
}

export function handleAuthExpired() {
  storage.remove(AUTH_KEY);
  update(
    (draft) => {
      draft.session = null;
    },
    { touchMeta: false },
  );
}

export async function login(username, password) {
  const normalized = normalizeUsername(username);
  if (!normalized || !password) {
    return { ok: false, error: 'Username dan password wajib diisi.' };
  }

  const remote = await remoteLogin(normalized, password);
  if (remote.ok) {
    const user = storeRemoteLogin(remote, password);
    loadRemoteUsers().catch(() => {});
    return { ok: true, user, remote: true };
  }

  if (remote.fatal) {
    // The server knows this username but rejected the password. On the owner's
    // legacy device, a missing server user can still be seeded first.
    if (adminKey() && (await bootstrapAccounts())) {
      const retry = await remoteLogin(normalized, password);
      if (retry.ok) {
        const user = storeRemoteLogin(retry, password);
        loadRemoteUsers().catch(() => {});
        return { ok: true, user, remote: true };
      }
    }
    return { ok: false, error: remote.error };
  }

  // Server/accounts not reachable: keep offline access with the local account.
  const local = loginLocal(normalized, password);
  if (!local.ok) return { ok: false, error: remote.error || local.error };

  if (adminKey()) {
    const seeded = await bootstrapAccounts();
    if (seeded) {
      const retry = await remoteLogin(normalized, password);
      if (retry.ok) {
        const user = storeRemoteLogin(retry, password);
        loadRemoteUsers().catch(() => {});
        return { ok: true, user, remote: true };
      }
    }
  }

  return {
    ...local,
    warning: remote.warning || '',
  };
}

export function logout() {
  storage.remove(AUTH_KEY);
  update(
    (draft) => {
      draft.session = null;
    },
    { touchMeta: false },
  );
}

async function upsertLocalUser(user, password = '') {
  const nextUser = {
    ...user,
    id: String(user.id),
    passHash: password
      ? hashPassword(password)
      : (getState().users || []).find(
          (item) => String(item.username).toLowerCase() === String(user.username).toLowerCase(),
        )?.passHash || '',
  };

  update(
    (draft) => {
      draft.users = Array.isArray(draft.users) ? draft.users : [];
      const index = draft.users.findIndex(
        (item) =>
          String(item.id) === String(nextUser.id) ||
          String(item.username).toLowerCase() === String(nextUser.username).toLowerCase(),
      );
      if (index >= 0) draft.users[index] = { ...draft.users[index], ...nextUser };
      else draft.users.push(nextUser);
    },
    { touchMeta: false },
  );

  const auth = readAuthSession();
  if (auth && String(auth.user.id) === String(nextUser.id)) {
    storage.set(AUTH_KEY, { ...auth, user: { ...auth.user, ...nextUser } });
  }

  return getState().users.find((item) => String(item.id) === String(nextUser.id)) || nextUser;
}

export async function createUser({ name, username, password, role = 'staff' }) {
  requireOwner();
  const state = getState();
  const cleanName = String(name || '').trim();
  if (!cleanName) throw new Error('Nama lengkap wajib diisi.');
  const cleanUsername = validateUsername(username, state.users);
  validatePassword(password);
  if (!['owner', 'staff'].includes(role)) throw new Error('Role tidak valid.');

  if (hasApiAuth()) {
    const result = await apiFetch('/api/auth/users', {
      method: 'POST',
      headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ name: cleanName, username: cleanUsername, password, role }),
    });
    if (result) {
      if (result.response.ok && result.payload?.user) {
        return upsertLocalUser(result.payload.user, password);
      }
      throw new Error(result.payload?.error || 'Gagal membuat akun di server.');
    }
  }

  const user = {
    id: nextId(state.users),
    name: cleanName,
    username: cleanUsername,
    passHash: hashPassword(password),
    role,
    active: true,
    createdAt: new Date().toISOString(),
  };

  update(
    (draft) => {
      draft.users.push(user);
    },
    { touchMeta: false },
  );

  return user;
}

export async function updateUser(id, { name, role, active }) {
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
    state.users.filter(
      (item) => item.role === 'owner' && item.active && item.id !== user.id,
    ).length === 0;
  if (removingLastOwner) throw new Error('Minimal harus ada satu owner aktif.');

  if (hasApiAuth()) {
    const result = await apiFetch('/api/auth/users', {
      method: 'PATCH',
      headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        id,
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
      }),
    });
    if (result) {
      if (result.response.ok && result.payload?.user) {
        return upsertLocalUser(result.payload.user);
      }
      throw new Error(result.payload?.error || 'Gagal memperbarui akun di server.');
    }
  }

  update(
    (draft) => {
      const target = draft.users.find((item) => String(item.id) === String(id));
      if (!target) return;
      if (name !== undefined) target.name = String(name).trim();
      if (role !== undefined) target.role = role;
      if (active !== undefined) target.active = Boolean(active);
      target.updatedAt = new Date().toISOString();

      if (!target.active && String(draft.session?.userId) === String(target.id)) {
        draft.session = null;
      }
    },
    { touchMeta: false },
  );

  return getState().users.find((item) => String(item.id) === String(id));
}

export async function resetUserPassword(id, password) {
  requireOwner();
  const state = getState();
  const user = state.users.find((item) => String(item.id) === String(id));
  if (!user) throw new Error('Pengguna tidak ditemukan.');
  validatePassword(password);

  if (hasApiAuth()) {
    const result = await apiFetch('/api/auth/users', {
      method: 'PATCH',
      headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id, password }),
    });
    if (result) {
      if (result.response.ok && result.payload?.user) {
        return upsertLocalUser(result.payload.user, password);
      }
      throw new Error(result.payload?.error || 'Gagal mereset password di server.');
    }
  }

  update(
    (draft) => {
      const target = draft.users.find((item) => String(item.id) === String(id));
      if (!target) return;
      target.passHash = hashPassword(password);
      target.updatedAt = new Date().toISOString();
    },
    { touchMeta: false },
  );

  return getState().users.find((item) => String(item.id) === String(id));
}

export async function deleteUser(id) {
  requireOwner();
  const state = getState();
  const user = state.users.find((item) => String(item.id) === String(id));
  if (!user) throw new Error('Pengguna tidak ditemukan.');
  if (String(user.id) === String(state.session?.userId)) {
    throw new Error('Anda tidak dapat menghapus akun yang sedang digunakan.');
  }
  if (
    user.role === 'owner' &&
    state.users.filter((item) => item.role === 'owner' && item.active).length <= 1
  ) {
    throw new Error('Minimal harus ada satu owner aktif.');
  }

  if (hasApiAuth()) {
    const result = await apiFetch(
      `/api/auth/users?id=${encodeURIComponent(String(id))}`,
      {
        method: 'DELETE',
        headers: getApiAuthHeaders(),
      },
    );
    if (result && !result.response.ok) {
      throw new Error(result.payload?.error || 'Gagal menghapus akun di server.');
    }
  }

  update(
    (draft) => {
      draft.users = draft.users.filter((item) => String(item.id) !== String(id));
    },
    { touchMeta: false },
  );
}

/**
 * Reset an owner password using the Casa Ramire admin key. The server stores
 * the authoritative hash so the new password works on every device.
 */
export async function resetPasswordWithRecoveryKey({ username, newPassword, recoveryKey }) {
  const normalized = normalizeUsername(username);
  const key = String(recoveryKey || '').trim();

  if (!normalized) throw new Error('Username owner wajib diisi.');
  if (!key) throw new Error('Kunci admin wajib diisi.');
  validatePassword(newPassword);

  const state = getState();
  const localUser = state.users.find((item) => item.username.toLowerCase() === normalized);

  // Trust the key when it matches this device's stored key; otherwise verify
  // it against the server.
  let verified = String(state.settings?.catalogAdminKey || '').trim() === key;
  if (!verified) {
    let response;
    try {
      response = await fetch('/api/state', {
        headers: { Accept: 'application/json', 'x-admin-key': key },
        cache: 'no-store',
      });
    } catch {
      throw new Error(
        'Tidak dapat memverifikasi kunci admin. Periksa koneksi internet atau masukkan kunci yang tersimpan di perangkat ini.',
      );
    }
    if (response.status === 401) throw new Error('Kunci admin tidak valid.');
    if (!response.ok) throw new Error('Verifikasi kunci admin gagal. Coba lagi.');
    verified = true;
  }

  if (!verified) throw new Error('Kunci admin tidak valid.');
  if (localUser && localUser.role !== 'owner') {
    throw new Error('Reset mandiri hanya untuk akun owner. Minta owner mereset akun staf.');
  }

  try {
    const response = await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalized, newPassword, recoveryKey: key }),
    });
    const payload = await readJson(response);
    if (response.status === 401) throw new Error('Kunci admin tidak valid.');
    if (response.status === 403) throw new Error(payload?.error || 'Akun ini bukan owner.');
    // 404 = server accounts not seeded yet; the local update below still lets
    // the owner log in on this device and seed accounts afterwards.
    if (!response.ok && response.status !== 404) {
      throw new Error(payload?.error || 'Gagal mereset password di server.');
    }
    if (response.ok && payload?.user) {
      await upsertLocalUser(payload.user, newPassword);
      return getState().users.find(
        (item) => item.username.toLowerCase() === normalized,
      );
    }
  } catch (error) {
    if (error instanceof TypeError) {
      // Offline: keep the local reset as a fallback.
    } else {
      throw error;
    }
  }

  if (!localUser) {
    throw new Error('Username owner tidak ditemukan di perangkat ini.');
  }

  update(
    (draft) => {
      const target = draft.users.find((item) => item.username.toLowerCase() === normalized);
      if (!target) return;
      target.passHash = hashPassword(newPassword);
      target.updatedAt = new Date().toISOString();
    },
    { touchMeta: false },
  );

  return getState().users.find((item) => item.username.toLowerCase() === normalized);
}

/** Owner password recovery by email code, handled by the server account store. */
export async function requestOwnerResetCode(username) {
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error('Username owner wajib diisi.');

  let response;
  try {
    response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalized }),
    });
  } catch {
    throw new Error('Layanan email tidak dapat dihubungi. Coba lagi beberapa saat lagi.');
  }

  const result = await readJson(response);
  if (!response.ok) {
    throw new Error(String(result.error || 'Gagal mengirim kode reset password.'));
  }
  return result;
}

export async function confirmOwnerResetCode({ username, code, newPassword }) {
  const normalized = normalizeUsername(username);
  const cleanCode = String(code || '').replace(/\D/g, '');
  if (!normalized) throw new Error('Username owner wajib diisi.');
  if (cleanCode.length !== 6) throw new Error('Kode verifikasi harus 6 digit.');
  validatePassword(newPassword);

  let response;
  try {
    response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalized, code: cleanCode, newPassword }),
    });
  } catch {
    throw new Error('Layanan reset password tidak dapat dihubungi.');
  }

  const result = await readJson(response);
  if (!response.ok) throw new Error(String(result.error || 'Kode reset tidak valid.'));

  const localUser = getState().users.find(
    (item) => item.username.toLowerCase() === normalized,
  );
  if (localUser) {
    update(
      (draft) => {
        const target = draft.users.find(
          (item) => item.username.toLowerCase() === normalized,
        );
        if (!target) return;
        target.passHash = hashPassword(newPassword);
        target.updatedAt = new Date().toISOString();
      },
      { touchMeta: false },
    );
  }

  return (
    getState().users.find((item) => item.username.toLowerCase() === normalized) || {
      username: normalized,
    }
  );
}

export async function changeOwnPassword(currentPassword, newPassword) {
  const user = getActiveUser();
  if (!user) throw new Error('Sesi tidak valid.');
  validatePassword(newPassword);

  if (getAuthToken()) {
    let response;
    try {
      response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch {
      throw new Error('Server tidak dapat dihubungi. Coba lagi.');
    }
    const payload = await readJson(response);
    if (!response.ok) {
      throw new Error(payload?.error || 'Gagal mengganti password.');
    }
    if (payload?.token) {
      storage.set(AUTH_KEY, {
        token: payload.token,
        expiresAt: payload.expiresAt,
        user: { ...user, ...(payload.user || {}) },
      });
    }
  } else if (!verifyPassword(currentPassword, user.passHash)) {
    throw new Error('Password saat ini salah.');
  }

  update(
    (draft) => {
      const target = draft.users.find((item) => String(item.id) === String(user.id));
      if (target) {
        target.passHash = hashPassword(newPassword);
        target.updatedAt = new Date().toISOString();
      }
    },
    { touchMeta: false },
  );
}
