import { DEFAULT_DEPOSIT, PAYMENT_METHODS } from '../core/constants.js';
import { rupiah, todayISO } from '../core/format.js';
import {
  getDepositAccount,
  getDepositAccounts,
  refundDeposit,
  setDepositPaid,
  setDepositTarget,
} from '../services/deposit.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

function methodOptions(selected = 'Tunai / Cash') {
  return PAYMENT_METHODS.map(
    (method) =>
      `<option value="${esc(method)}" ${selected === method ? 'selected' : ''}>${esc(method)}</option>`,
  ).join('');
}

export function openDepositAdjustModal(kind, id, onDone) {
  const account = getDepositAccount(kind, id);
  if (!account) {
    toast('Data deposit tidak ditemukan.', 'error');
    return;
  }

  openModal({
    title: 'Catat / Sesuaikan Deposit',
    subtitle: `${account.name} • Kamar ${account.roomNumber}`,
    size: 'md',
    body: `
      <form id="deposit-adjust-form" class="space-y-4" novalidate>
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-1.5">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Deposit ditargetkan</span><b class="text-stone-800">${rupiah(account.deposit)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Sudah diterima</span><b class="text-stone-800">${rupiah(account.depositPaid)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Sudah dikembalikan</span><b class="text-stone-800">${rupiah(account.depositRefunded)}</b></div>
          <div class="flex justify-between gap-3 pt-1.5 border-t border-line"><span class="text-stone-500">Sisa deposit belum dibayar</span><b class="${account.outstanding ? 'text-rose-700' : 'text-emerald-700'}">${rupiah(account.outstanding)}</b></div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="dep-target">Deposit ditargetkan (Rp)</label>
            <input id="dep-target" type="number" min="0" step="1000" class="input" value="${account.deposit}" />
          </div>
          <div>
            <label class="label" for="dep-amount">Total sudah diterima (Rp)</label>
            <input id="dep-amount" type="number" min="0" step="1000" class="input" value="${account.depositPaid}" />
          </div>
        </div>
        <p class="hint">Masukkan total kumulatif, bukan tambahan. Contoh: sudah terima Rp500.000 → isi 500000.</p>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="dep-date">Tanggal</label>
            <input id="dep-date" type="date" class="input" value="${todayISO()}" />
          </div>
          <div>
            <label class="label" for="dep-method">Metode</label>
            <select id="dep-method" class="select">${methodOptions()}</select>
          </div>
        </div>
        <div>
          <label class="label" for="dep-note">Catatan</label>
          <input id="dep-note" type="text" class="input" placeholder="cth: transfer BCA / pelunasan deposit" />
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900 leading-relaxed">
          Deposit adalah uang jaminan, bukan pendapatan. Uang masuk tetapi dicatat sebagai kewajiban sampai dikembalikan saat check-out.
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="deposit-adjust-form" class="btn-primary btn-sm">${icon('Save', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('#deposit-adjust-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          setDepositTarget(kind, id, el.querySelector('#dep-target').value);
          setDepositPaid(kind, id, el.querySelector('#dep-amount').value, {
            date: el.querySelector('#dep-date').value || todayISO(),
            method: el.querySelector('#dep-method').value,
            note: el.querySelector('#dep-note').value,
          });
          toast('Status deposit berhasil diperbarui.');
          close();
          onDone?.();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

export function openDepositRefundModal(kind, id, onDone) {
  const account = getDepositAccount(kind, id);
  if (!account) {
    toast('Data deposit tidak ditemukan.', 'error');
    return;
  }
  if (account.depositHeld <= 0) {
    toast('Tidak ada deposit yang bisa dikembalikan.', 'warning');
    return;
  }

  openModal({
    title: 'Kembalikan Deposit',
    subtitle: `${account.name} • Kamar ${account.roomNumber}`,
    size: 'md',
    body: `
      <form id="deposit-refund-form" class="space-y-4" novalidate>
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Deposit ditahan</p>
          <p class="text-2xl font-black text-emerald-900 mt-1">${rupiah(account.depositHeld)}</p>
        </div>
        <div>
          <label class="label" for="ref-amount">Nominal dikembalikan (Rp)</label>
          <input id="ref-amount" type="number" min="0" step="1000" class="input" value="${account.depositHeld}" />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="ref-date">Tanggal</label>
            <input id="ref-date" type="date" class="input" value="${todayISO()}" />
          </div>
          <div>
            <label class="label" for="ref-method">Metode</label>
            <select id="ref-method" class="select">${methodOptions()}</select>
          </div>
        </div>
        <div>
          <label class="label" for="ref-note">Catatan</label>
          <input id="ref-note" type="text" class="input" value="Pengembalian deposit check-out" />
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="deposit-refund-form" class="btn-danger btn-sm">${icon('ArrowDownRight', 'w-4 h-4')} Kembalikan Deposit</button>
    `,
    onMount(el, close) {
      el.querySelector('#deposit-refund-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          refundDeposit(kind, id, el.querySelector('#ref-amount').value, {
            date: el.querySelector('#ref-date').value || todayISO(),
            method: el.querySelector('#ref-method').value,
            note: el.querySelector('#ref-note').value || 'Pengembalian deposit check-out',
          });
          toast('Pengembalian deposit berhasil dicatat.');
          close();
          onDone?.();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function parseMoney(value) {
  const digits = String(value ?? '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function parseDelimited(line, delimiter) {
  if (delimiter === ',') {
    const cells = [];
    let current = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (quoted && line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === ',' && !quoted) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);
    return cells;
  }
  return line.split(delimiter);
}

function parseDepositRows(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const rows = lines.map((line) => parseDelimited(line, delimiter).map((cell) => cell.trim()));
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => /no\s*kamar|kamar/i.test(cell)) &&
    row.some((cell) => /deposit/i.test(cell)),
  );

  let roomIndex = 0;
  let depositIndex = 2;
  let remarksIndex = -1;
  let dataRows = rows;

  if (headerIndex >= 0) {
    const header = rows[headerIndex].map((cell) => cell.toLowerCase());
    roomIndex = header.findIndex((cell) => /no\s*kamar|kamar/.test(cell));
    depositIndex = header.findIndex((cell) => /deposit/.test(cell));
    remarksIndex = header.findIndex((cell) => /remark|catatan|keterangan/.test(cell));
    dataRows = rows.slice(headerIndex + 1);
  } else {
    // No header: assume "kamar, nama, deposit" or "kamar, deposit".
    depositIndex = rows[0].length >= 3 && parseMoney(rows[0][1]) === 0 ? 2 : 1;
  }

  return dataRows
    .map((row) => {
      const roomNumber = String(row[roomIndex] || '').replace(/[^\d]/g, '');
      if (!roomNumber) return null;
      const deposit = parseMoney(row[depositIndex]);
      const remarks = remarksIndex >= 0 ? String(row[remarksIndex] || '') : '';
      const remarksUnpaid = /belum\s*bayar\s*deposit|deposit\s*belum/i.test(remarks);
      return {
        roomNumber,
        deposit: remarksUnpaid ? 0 : deposit,
        remarks,
        conflict: remarksUnpaid && deposit > 0,
      };
    })
    .filter(Boolean);
}

export function openDepositImportModal(onDone) {
  openModal({
    title: 'Impor Status Deposit',
    subtitle: 'Tempel data dari Google Sheets. Status dicocokkan berdasarkan nomor kamar.',
    size: 'lg',
    body: `
      <div class="space-y-4">
        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900 leading-relaxed">
          Format yang didukung: salin baris dari spreadsheet dengan kolom <b>No Kamar</b>, <b>Nama</b>, <b>Deposit</b>, dan <b>Remarks</b>.
          Impor ini menimpa status deposit akun yang nomor kamarnya cocok.
        </div>
        <div>
          <label class="label" for="dep-import-text">Data spreadsheet</label>
          <textarea id="dep-import-text" rows="10" class="input font-mono text-[11px]" placeholder="No Kamar&#9;Nama Penghuni&#9;...&#9;Deposit&#9;...&#9;Remarks&#10;201&#9;Lita&#9;...&#9;Rp0&#9;...&#9;&#10;202&#9;Yosefhin&#9;...&#9;Rp500.000&#9;...&#9;"></textarea>
        </div>
        <p class="hint">Baris dengan catatan “belum bayar deposit” akan dianggap belum dibayar.</p>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-import>${icon('Upload', 'w-4 h-4')} Impor</button>
    `,
    onMount(el, close) {
      el.querySelector('[data-import]')?.addEventListener('click', () => {
        const rows = parseDepositRows(el.querySelector('#dep-import-text').value);
        if (!rows.length) {
          toast('Tidak ada baris data yang bisa dibaca.', 'warning');
          return;
        }

        const accounts = getDepositAccounts();
        const byRoom = new Map(accounts.map((account) => [String(account.roomNumber), account]));
        let updated = 0;
        const unmatched = [];
        const conflicts = [];

        for (const row of rows) {
          const account = byRoom.get(String(row.roomNumber));
          if (!account) {
            unmatched.push(row.roomNumber);
            continue;
          }
          try {
            if (account.deposit <= 0) {
              setDepositTarget(account.kind, account.id, DEFAULT_DEPOSIT);
            }
            setDepositPaid(account.kind, account.id, row.deposit, {
              date: todayISO(),
              method: 'Impor spreadsheet',
              note: 'Impor status deposit',
              // Keep real transaction history; replace only legacy/synthetic
              // history so importing a corrected sheet does not create noise.
              replaceHistory: !account.hasStoredHistory,
            });
            updated += 1;
            if (row.conflict) conflicts.push(row.roomNumber);
          } catch (error) {
            toast(`Kamar ${row.roomNumber}: ${error.message}`, 'error');
          }
        }

        close();
        toast(
          `Impor deposit selesai: ${updated} kamar diperbarui${unmatched.length ? `, ${unmatched.length} tidak cocok` : ''}.`,
          updated ? 'success' : 'warning',
        );
        if (conflicts.length) {
          toast(`Kamar dengan catatan “belum bayar deposit”: ${conflicts.join(', ')}.`, 'warning', 6000);
        }
        onDone?.();
      });
    },
  });
}
