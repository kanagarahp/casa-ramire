/** ID helpers. IDs are numeric per collection to keep URLs/attributes simple. */

export function nextId(list = []) {
  return list.reduce((max, item) => Math.max(max, Number(item?.id) || 0), 0) + 1;
}

export function randomToken(length = 8) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(length);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < length; i += 1) out += alphabet[bytes[i] % alphabet.length];
    return out;
  }
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/** Human-readable document number, e.g. INV/202610/0007. */
export function documentNumber(prefix, list = []) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const sequence = String(nextId(list)).padStart(4, '0');
  return `${prefix}/${stamp}/${sequence}`;
}
