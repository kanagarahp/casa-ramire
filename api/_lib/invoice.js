import {
  LineCapStyle,
  PDFDocument,
  StandardFonts,
  rgb,
} from 'pdf-lib';

const PAGE = { width: 595.28, height: 841.89, margin: 40 };
const HEADER_HEIGHT = 112;

const COLORS = {
  dark: rgb(31 / 255, 57 / 255, 56 / 255),
  gold: rgb(212 / 255, 163 / 255, 89 / 255),
  logoGold: rgb(201 / 255, 154 / 255, 74 / 255),
  white: rgb(1, 1, 1),
  text: rgb(41 / 255, 37 / 255, 36 / 255),
  gray: rgb(120 / 255, 113 / 255, 108 / 255),
  softGray: rgb(168 / 255, 162 / 255, 158 / 255),
  light: rgb(245 / 255, 245 / 255, 244 / 255),
  green: rgb(4 / 255, 120 / 255, 87 / 255),
  greenSoft: rgb(236 / 255, 253 / 255, 245 / 255),
  red: rgb(190 / 255, 18 / 255, 60 / 255),
  line: rgb(231 / 255, 229 / 255, 228 / 255),
};

const BRAND_PATHS = {
  house:
    'M 330 430 L 330 230 L 512 90 L 672 232 L 648 256 L 648 430',
  houseBottom: 'M 330 430 C 390 485 590 485 648 430',
  stems: [
    'M 468 468 L 545 292',
    'M 505 398 L 632 330',
    'M 525 392 L 612 432',
  ],
  leaves: [
    'M 515 365 C 500 305 512 215 562 170 C 598 225 590 315 548 355 Z',
    'M 505 360 C 465 325 415 292 388 278 C 414 330 460 368 500 388 Z',
    'M 548 360 C 598 325 648 305 680 305 C 660 352 610 388 560 395 Z',
    'M 535 410 C 585 393 638 403 678 435 C 625 466 575 450 532 425 Z',
  ],
};

function toNumber(value) {
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value) {
  return `Rp${Math.round(toNumber(value)).toLocaleString('id-ID')}`;
}

function dateOnly(value) {
  const raw = String(value || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
}

function formatDateID(value, { long = false } = {}) {
  const raw = dateOnly(value);
  if (!raw) return '-';
  const date = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: long ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatDateTimeID(value) {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return formatDateID(value);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

function pdfSafe(value) {
  return String(value ?? '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2022\u00b7]/g, '-')
    .replace(/[^\x20-\x7e\xa0-\xff]/g, '?');
}

function truncate(value, max = 90) {
  const text = String(value || '').trim();
  return text.length > max ? `${text.slice(0, Math.max(0, max - 3))}...` : text;
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );
}

function findTenant(state, tenantId) {
  if (!tenantId) return null;
  return (
    (state.tenants || []).find(
      (tenant) => String(tenant.id) === String(tenantId),
    ) || null
  );
}

function propertyOf(state) {
  const settings = state?.settings || {};
  return {
    name: String(settings.propertyName || 'Casa Ramire').trim(),
    address: String(settings.address || '').trim(),
    whatsapp: String(settings.whatsapp || '').trim(),
    email: String(settings.email || 'casaramirejogja@gmail.com').trim(),
    bankName: String(settings.bankName || 'Bank Mandiri').trim(),
    bankAccountNumber: String(settings.bankAccountNumber || '700013745877').trim(),
    bankAccountName: String(settings.bankAccountName || 'ERNY KURNIAWATI').trim(),
    paymentInstructions: String(settings.paymentInstructions || '').trim(),
  };
}

function clientOf(record, tenant) {
  return {
    name: String(record.tenantName || record.customerName || tenant?.name || 'Pelanggan').trim(),
    address: String(record.address || tenant?.address || '').trim(),
    phone: String(record.phone || record.customerPhone || tenant?.phone || '').trim(),
    email: String(record.email || record.customerEmail || tenant?.email || '')
      .trim()
      .toLowerCase(),
  };
}

function posItems(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    title: String(item.name || 'Layanan').trim(),
    subtitle: [
      `${Number(item.qty || 0).toLocaleString('id-ID', {
        maximumFractionDigits: 2,
      })}${item.unit ? ` ${item.unit}` : ''} x ${money(item.price)}`,
      item.category && item.category !== 'Lainnya' ? item.category : '',
    ]
      .filter(Boolean)
      .join(' · '),
    amount: toNumber(item.subtotal ?? toNumber(item.price) * toNumber(item.qty)),
  }));
}

function statusOf(record) {
  return record?.status === 'paid' ? 'paid' : 'unpaid';
}

/**
 * Convert a stored bill, manual invoice, or POS sale into one invoice shape
 * used by both the PDF renderer and the email composer.
 */
export function normalizeInvoice(state, { type, id }) {
  const property = propertyOf(state);
  const bill = (state.bills || []).find((item) => String(item.id) === String(id));
  const invoice = (state.manualInvoices || []).find(
    (item) => String(item.id) === String(id),
  );
  const sale = (state.posSales || []).find((item) => String(item.id) === String(id));

  if (type === 'bill' && bill) {
    const tenant = findTenant(state, bill.tenantId);
    const periodStart = bill.periodStart || '';
    const periodEnd = bill.periodEnd || '';
    const period =
      periodStart && periodEnd
        ? `${formatDateID(periodStart)} - ${formatDateID(periodEnd)}`
        : '';
    return {
      type: 'bill',
      id: bill.id,
      number: bill.number || `INV-${bill.id}`,
      status: statusOf(bill),
      dateISO: bill.paidAt || bill.createdAt || bill.dueDate,
      dueDate: bill.dueDate || '',
      paidAt: bill.paidAt || '',
      method: bill.method || '',
      note: bill.note || '',
      client: clientOf(bill, tenant),
      items: [
        {
          title: `Pembayaran Kamar #${bill.roomNumber || '-'} | ${bill.type || 'Sewa'}`,
          subtitle: period
            ? `Periode ${period}`
            : bill.description || `Jatuh tempo ${formatDateID(bill.dueDate)}`,
          amount: toNumber(bill.amount),
        },
      ],
      subtotal: toNumber(bill.amount),
      discount: 0,
      total: toNumber(bill.amount),
      paid: toNumber(bill.paid),
      outstanding: Math.max(0, toNumber(bill.amount) - toNumber(bill.paid)),
      property,
      meta: { periodStart, periodEnd, roomNumber: bill.roomNumber || '' },
    };
  }

  if (type === 'invoice' && invoice) {
    const tenant = findTenant(state, invoice.tenantId);
    const items = posItems(invoice.items);
    const subtotal = toNumber(
      invoice.subtotal ?? items.reduce((sum, item) => sum + item.amount, 0),
    );
    const total = toNumber(invoice.amount ?? subtotal);
    return {
      type: 'invoice',
      id: invoice.id,
      number: invoice.number || `SRV-${invoice.id}`,
      status: statusOf(invoice),
      dateISO: invoice.paidAt || invoice.createdAt || invoice.dueDate,
      dueDate: invoice.dueDate || '',
      paidAt: invoice.paidAt || '',
      method: invoice.method || '',
      note: invoice.note || '',
      client: clientOf(invoice, tenant),
      items: items.length
        ? items
        : [
            {
              title: invoice.item || 'Layanan',
              subtitle:
                invoice.note ||
                `Jatuh tempo ${formatDateID(invoice.dueDate)}`,
              amount: total,
            },
          ],
      subtotal,
      discount: toNumber(invoice.discount),
      total,
      paid: toNumber(invoice.paid ?? invoice.amountPaid),
      outstanding: Math.max(0, total - toNumber(invoice.paid ?? invoice.amountPaid)),
      property,
      meta: { roomNumber: invoice.roomNumber || '', source: invoice.source || 'manual' },
    };
  }

  if (type === 'pos' && sale) {
    const tenant = findTenant(state, sale.tenantId);
    const items = posItems(sale.items);
    const subtotal = toNumber(
      sale.subtotal ?? items.reduce((sum, item) => sum + item.amount, 0),
    );
    const total = toNumber(sale.total ?? subtotal);
    return {
      type: 'pos',
      id: sale.id,
      number: sale.number || sale.invoiceNumber || `POS-${sale.id}`,
      status: statusOf(sale),
      dateISO: sale.paidAt || sale.createdAt || sale.date,
      dueDate: sale.dueDate || '',
      paidAt: sale.paidAt || '',
      method: sale.method || '',
      note: sale.note || '',
      client: clientOf(sale, tenant),
      items,
      subtotal,
      discount: toNumber(sale.discount),
      total,
      paid: sale.status === 'paid' ? toNumber(sale.amountPaid ?? total) : 0,
      outstanding: sale.status === 'paid' ? 0 : total,
      property,
      meta: { roomNumber: sale.roomNumber || '' },
    };
  }

  return null;
}

export function invoiceRecipient(invoice) {
  return String(invoice?.client?.email || '').trim().toLowerCase();
}

export function invoiceFilename(invoice) {
  const number = String(invoice?.number || 'Invoice')
    .replace(/[\\/:*?"<>|\s]+/g, '-')
    .replace(/-+/g, '-');
  return `Invoice-${number}.pdf`;
}

export function buildInvoiceEmail(invoice, { mode = 'billing', paymentUrl = '', expiresAt = '' } = {}) {
  const paid = mode === 'paid' || invoice.status === 'paid';
  const property = invoice.property;
  const name = invoice.client.name || 'Kak';
  const itemSummary = invoice.items.map((item) => item.title).join(', ');
  const amount = money(
    invoice.status === 'paid' ? invoice.total : invoice.outstanding || invoice.total,
  );
  const dateLabel = formatDateID(invoice.dateISO);
  const dueLabel = formatDateID(invoice.dueDate);
  const method = invoice.method || '-';

  const signature = [
    '',
    property.name,
    property.address || '',
    property.whatsapp ? `WhatsApp: ${property.whatsapp}` : '',
    property.email ? `Email: ${property.email}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  if (paid) {
    const subject = `Terima kasih, pembayaran ${invoice.number} sudah diterima - ${property.name}`;
    const text = [
      `Halo ${name},`,
      '',
      'Terima kasih! Pembayaran Anda sudah kami terima dan verifikasi.',
      '',
      `Nomor invoice : ${invoice.number}`,
      `Jenis         : ${itemSummary}`,
      `Nominal       : ${amount}`,
      `Metode        : ${method}`,
      `Tanggal       : ${dateLabel}`,
      invoice.meta?.roomNumber ? `Kamar         : ${invoice.meta.roomNumber}` : null,
      '',
      'Invoice resmi dalam format PDF terlampir. Simpan email ini sebagai bukti pembayaran.',
      '',
      `Kami senang Anda menjadi bagian dari ${property.name}. Jika ada pertanyaan, hubungi WhatsApp admin${property.whatsapp ? ` di ${property.whatsapp}` : ''} atau balas email ini.`,
      signature,
    ]
      .filter((line) => line !== null && line !== undefined)
      .join('\n');

    return {
      subject,
      text,
      html: invoiceEmailHtml({
        invoice,
        paid: true,
        heading: 'Pembayaran diterima',
        intro: `Terima kasih, ${name}. Pembayaran Anda sudah kami terima dan verifikasi.`,
        note: 'Invoice resmi dalam format PDF terlampir. Simpan email ini sebagai bukti pembayaran.',
      }),
    };
  }

  const reminder = mode === 'reminder';
  const subject = reminder
    ? `Pengingat H-3: ${itemSummary} - ${property.name}`
    : `Invoice ${invoice.number} - ${property.name}`;
  const intro = reminder
    ? `Kami ingatkan bahwa tagihan berikut akan jatuh tempo dalam 3 hari.`
    : `Berikut invoice ${invoice.number} untuk ${itemSummary}.`;
  const text = [
    `Halo ${name},`,
    '',
    intro,
    '',
    `Nomor invoice : ${invoice.number}`,
    `Jenis         : ${itemSummary}`,
    `Nominal       : ${amount}`,
    `Jatuh tempo   : ${dueLabel}`,
    invoice.meta?.roomNumber ? `Kamar         : ${invoice.meta.roomNumber}` : null,
    '',
    paymentUrl
      ? 'Silakan lakukan pembayaran melalui link berikut:'
      : 'Silakan transfer ke:',
    paymentUrl || null,
    paymentUrl ? (expiresAt ? `Link berlaku sampai: ${expiresAt}` : null) : property.bankName,
    paymentUrl ? null : `No. Rekening: ${property.bankAccountNumber}`,
    paymentUrl ? null : `a.n. ${property.bankAccountName}`,
    '',
    paymentUrl
      ? 'Status pembayaran akan diperbarui otomatis setelah pembayaran berhasil.'
      : property.paymentInstructions ||
        'Setelah transfer, kirim bukti pembayaran ke WhatsApp admin Casa Ramire.',
    '',
    'Invoice resmi dalam format PDF terlampir.',
    signature,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n');

  return {
    subject,
    text,
    html: invoiceEmailHtml({
      invoice,
      paid: false,
      heading: reminder ? 'Pengingat pembayaran H-3' : 'Invoice Anda',
      intro: `Halo ${name}, ${intro}`,
      note: 'Invoice resmi dalam format PDF terlampir.',
      paymentUrl,
      expiresAt,
    }),
  };
}

function invoiceEmailHtml({ invoice, paid, heading, intro, note, paymentUrl = '', expiresAt = '' }) {
  const property = invoice.property;
  const itemRows = invoice.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;">
            <div style="font-weight:700;color:#292524;">${escapeHtml(item.title)}</div>
            ${item.subtitle ? `<div style="font-size:12px;color:#78716c;margin-top:2px;">${escapeHtml(item.subtitle)}</div>` : ''}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;text-align:right;white-space:nowrap;font-weight:700;color:#292524;">${money(item.amount)}</td>
        </tr>`,
    )
    .join('');

  const bankBlock = paid
    ? ''
    : paymentUrl
      ? `<p style="margin:18px 0 0;"><a href="${escapeHtml(paymentUrl)}" style="display:inline-block;background:#1f3938;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:10px;font-weight:700;">Bayar sekarang</a></p>
         ${expiresAt ? `<p style="margin:8px 0 0;font-size:12px;color:#78716c;">Link berlaku sampai ${escapeHtml(expiresAt)}.</p>` : ''}`
      : `<div style="margin-top:18px;padding:14px;border-radius:12px;background:#f5f5f4;font-size:13px;line-height:1.6;color:#44403c;">
           <div style="font-weight:700;color:#292524;margin-bottom:4px;">Transfer pembayaran</div>
           ${escapeHtml(property.bankName)}<br />
           No. Rekening: <b>${escapeHtml(property.bankAccountNumber)}</b><br />
           a.n. ${escapeHtml(property.bankAccountName)}
         </div>`;

  return `<!doctype html>
  <html lang="id">
    <body style="margin:0;padding:0;background:#f5f5f4;font-family:Arial,Helvetica,sans-serif;color:#292524;">
      <div style="max-width:640px;margin:0 auto;padding:24px 12px;">
        <div style="border-radius:18px;overflow:hidden;background:#ffffff;border:1px solid #e7e5e4;">
          <div style="background:#1f3938;color:#ffffff;padding:26px 30px;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:700;letter-spacing:.14em;color:#c99a4a;text-transform:uppercase;">${escapeHtml(property.name)}</div>
            <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">${escapeHtml(heading)}</h1>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#d6d3d1;">${escapeHtml(intro)}</p>
          </div>
          <div style="padding:26px 30px;">
            <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px;">
              <div>
                <div style="font-size:11px;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Ditagihkan kepada</div>
                <div style="font-weight:700;margin-top:4px;">${escapeHtml(invoice.client.name)}</div>
                ${invoice.client.phone ? `<div style="font-size:13px;color:#57534e;">${escapeHtml(invoice.client.phone)}</div>` : ''}
                ${invoice.meta?.roomNumber ? `<div style="font-size:13px;color:#57534e;">Kamar ${escapeHtml(invoice.meta.roomNumber)}</div>` : ''}
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">No. Invoice</div>
                <div style="font-weight:700;margin-top:4px;">${escapeHtml(invoice.number)}</div>
                <div style="font-size:13px;color:#57534e;">${formatDateID(invoice.dueDate || invoice.dateISO)}</div>
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:0 0 8px;border-bottom:2px solid #1f3938;font-size:12px;">Item</th>
                  <th style="text-align:right;padding:0 0 8px;border-bottom:2px solid #1f3938;font-size:12px;">Total</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="margin-top:18px;background:#1f3938;color:#ffffff;border-radius:10px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
              <div style="font-weight:700;">Total</div>
              <div style="font-size:20px;font-weight:800;">${money(invoice.total)}</div>
            </div>
            ${paid ? `<div style="margin-top:14px;padding:12px 14px;border-radius:10px;background:#ecfdf5;color:#047857;font-size:13px;font-weight:700;">Pembayaran sudah diterima${invoice.method ? ` via ${escapeHtml(invoice.method)}` : ''}.</div>` : ''}
            ${bankBlock}
            <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#57534e;">${escapeHtml(note)}</p>
          </div>
          <div style="padding:18px 30px;background:#fafaf9;border-top:1px solid #e7e5e4;font-size:12px;line-height:1.6;color:#78716c;">
            ${escapeHtml(property.name)}${property.address ? ` · ${escapeHtml(property.address)}` : ''}<br />
            ${property.whatsapp ? `WhatsApp: ${escapeHtml(property.whatsapp)}` : ''}${property.email ? ` · ${escapeHtml(property.email)}` : ''}
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function drawBrandMark(page, { left, top, scale, wordmarkFont }) {
  const originX = left - 300 * scale;
  const originY = top + 60 * scale;
  const origin = { x: originX, y: originY, scale };

  page.drawSvgPath(BRAND_PATHS.house, {
    ...origin,
    borderColor: COLORS.logoGold,
    borderWidth: 14,
    borderLineCap: LineCapStyle.Round,
  });
  page.drawSvgPath(BRAND_PATHS.houseBottom, {
    ...origin,
    borderColor: COLORS.logoGold,
    borderWidth: 14,
    borderLineCap: LineCapStyle.Round,
  });

  for (const leaf of BRAND_PATHS.leaves) {
    page.drawSvgPath(leaf, { ...origin, color: COLORS.white });
  }

  // Stems sit above the leaves, like the brand mark.
  for (const stem of BRAND_PATHS.stems) {
    page.drawSvgPath(stem, {
      ...origin,
      borderColor: COLORS.white,
      borderWidth: 8,
      borderLineCap: LineCapStyle.Round,
    });
  }

  const centerX = originX + 501 * scale;
  const wordmark = 'CASA RAMIRE';
  const wordmarkSize = 12.5;
  const wordmarkWidth = wordmarkFont.widthOfTextAtSize(
    wordmark,
    wordmarkSize,
  );
  page.drawText(wordmark, {
    x: centerX - wordmarkWidth / 2,
    y: top - 60,
    size: wordmarkSize,
    font: wordmarkFont,
    color: COLORS.logoGold,
  });

  return { centerX };
}

/**
 * Render the invoice as an A4 PDF. Uses only built-in Helvetica fonts so the
 * serverless function does not need to ship font files.
 */
export async function buildInvoicePdf(invoice) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const W = PAGE.width;
  const H = PAGE.height;
  const M = PAGE.margin;
  const right = W - M;

  let page = doc.addPage([W, H]);
  let y = H;

  const drawText = (value, { x, y: atY, size = 9, useBold = false, color = COLORS.text, align = 'left' }) => {
    const safe = pdfSafe(value);
    const usedFont = useBold ? bold : font;
    const width = usedFont.widthOfTextAtSize(safe, size);
    const drawX = align === 'right' ? x - width : align === 'center' ? x - width / 2 : x;
    page.drawText(safe, { x: drawX, y: atY, size, font: usedFont, color });
    return width;
  };

  const header = () => {
    page.drawRectangle({
      x: 0,
      y: H - HEADER_HEIGHT,
      width: W,
      height: HEADER_HEIGHT,
      color: COLORS.dark,
    });
    page.drawText(pdfSafe('Invoice'), {
      x: M,
      y: H - 68,
      size: 30,
      font: bold,
      color: COLORS.white,
    });

    const brand = drawBrandMark(page, {
      left: right - 70,
      top: H - 6,
      scale: 0.11,
      wordmarkFont: timesBold,
    });
    let contactY = H - 78;
    if (invoice.property.whatsapp) {
      drawText(`WA ${invoice.property.whatsapp}`, {
        x: brand.centerX,
        y: contactY,
        size: 5.8,
        color: rgb(0.82, 0.82, 0.8),
        align: 'center',
      });
      contactY -= 8;
    }
    if (invoice.property.email) {
      drawText(invoice.property.email, {
        x: brand.centerX,
        y: contactY,
        size: 5.8,
        color: rgb(0.82, 0.82, 0.8),
        align: 'center',
      });
    }
  };

  const tableHeader = () => {
    drawText('Items', { x: M + 10, y, size: 9, useBold: true });
    drawText('Total', { x: right - 10, y, size: 9, useBold: true, align: 'right' });
    page.drawLine({
      start: { x: M, y: y - 6 },
      end: { x: right, y: y - 6 },
      thickness: 0.8,
      color: COLORS.line,
    });
    y -= 22;
  };

  header();
  y = H - HEADER_HEIGHT - 34;

  drawText('Klien', { x: M, y, size: 12, useBold: true, color: COLORS.dark });
  page.drawLine({
    start: { x: M, y: y - 5 },
    end: { x: M + 38, y: y - 5 },
    thickness: 1.8,
    color: COLORS.logoGold,
  });

  if (invoice.status === 'paid') {
    page.drawRectangle({
      x: right - 48,
      y: y - 3,
      width: 48,
      height: 17,
      color: COLORS.greenSoft,
    });
    drawText('LUNAS', {
      x: right - 24,
      y: y + 1,
      size: 7.5,
      useBold: true,
      color: COLORS.green,
      align: 'center',
    });
  } else {
    page.drawRectangle({
      x: right - 72,
      y: y - 3,
      width: 72,
      height: 17,
      color: rgb(1, 0.98, 0.92),
    });
    drawText('BELUM DIBAYAR', {
      x: right - 36,
      y: y + 1,
      size: 6.4,
      useBold: true,
      color: rgb(0.71, 0.33, 0.04),
      align: 'center',
    });
  }

  y -= 22;
  const clientRows = [
    ['Nama', invoice.client.name || '-'],
    ['Alamat', invoice.client.address || '-'],
    ['Telepon', invoice.client.phone || '-'],
  ];
  for (const [label, value] of clientRows) {
    drawText(label, { x: M, y, size: 8, color: COLORS.gray });
    drawText(`: ${truncate(value, 76)}`, { x: M + 48, y, size: 8, color: COLORS.text });
    y -= 13;
  }

  y -= 18;
  tableHeader();

  invoice.items.forEach((item, index) => {
    const rowHeight = item.subtitle ? 32 : 24;
    if (y - rowHeight < 170) {
      page = doc.addPage([W, H]);
      y = H - 60;
      tableHeader();
    }

    if (index % 2 === 1) {
      page.drawRectangle({
        x: M,
        y: y - rowHeight + 8,
        width: right - M,
        height: rowHeight,
        color: COLORS.light,
      });
    }

    drawText(item.title, {
      x: M + 10,
      y: y - 8,
      size: 9,
      useBold: true,
      color: COLORS.text,
    });
    if (item.subtitle) {
      drawText(truncate(item.subtitle, 88), {
        x: M + 10,
        y: y - 20,
        size: 7.5,
        color: COLORS.gray,
      });
    }
    drawText(money(item.amount), {
      x: right - 10,
      y: y - 8,
      size: 9,
      color: COLORS.text,
      align: 'right',
    });
    y -= rowHeight;
  });

  if (invoice.subtotal !== invoice.total || invoice.discount > 0) {
    y -= 4;
    drawText('Subtotal', { x: right - 86, y, size: 8, color: COLORS.gray, align: 'right' });
    drawText(money(invoice.subtotal), { x: right - 10, y, size: 8, color: COLORS.text, align: 'right' });
    y -= 13;
    if (invoice.discount > 0) {
      drawText('Diskon', { x: right - 86, y, size: 8, color: COLORS.gray, align: 'right' });
      drawText(`-${money(invoice.discount)}`, { x: right - 10, y, size: 8, color: COLORS.red, align: 'right' });
      y -= 13;
    }
  }

  y -= 14;
  if (y < 120) {
    page = doc.addPage([W, H]);
    y = H - 80;
  }
  page.drawRectangle({
    x: M,
    y: y - 26,
    width: right - M,
    height: 30,
    color: COLORS.dark,
  });
  drawText('Total', {
    x: M + 10,
    y: y - 15,
    size: 11,
    useBold: true,
    color: COLORS.white,
  });
  drawText(money(invoice.total), {
    x: right - 10,
    y: y - 15,
    size: 11,
    useBold: true,
    color: COLORS.white,
    align: 'right',
  });
  y -= 44;

  drawText(`Tanggal : ${formatDateID(invoice.dateISO, { long: true })}`, {
    x: right,
    y,
    size: 7.5,
    color: COLORS.gray,
    align: 'right',
  });
  y -= 12;
  drawText(`No Order : ${invoice.number}`, {
    x: right,
    y,
    size: 7.5,
    color: COLORS.gray,
    align: 'right',
  });

  if (invoice.status !== 'paid') {
    const bank = invoice.property;
    const noteY = Math.max(74, y - 42);
    drawText('Pembayaran ke:', { x: M, y: noteY, size: 7.5, useBold: true, color: COLORS.dark });
    drawText(
      `${bank.bankName} · ${bank.bankAccountNumber} · a.n. ${bank.bankAccountName}`,
      { x: M, y: noteY - 11, size: 7.5, color: COLORS.gray },
    );
    drawText(`Jatuh tempo: ${formatDateID(invoice.dueDate)}`, {
      x: M,
      y: noteY - 22,
      size: 7.5,
      color: COLORS.red,
    });
  } else {
    drawText('Terima kasih atas pembayaran Anda.', {
      x: M,
      y: Math.max(74, y - 22),
      size: 7.5,
      color: COLORS.gray,
    });
  }

  return doc.save();
}

export function invoicePdfBase64(pdfBytes) {
  return Buffer.from(pdfBytes).toString('base64');
}
