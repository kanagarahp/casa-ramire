import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSeedState } from '../src/core/seed.js';
import { getState, replaceState } from '../src/core/store.js';
import { createManualInvoice } from '../src/services/billing.js';
import { buildCatalogSnapshot } from '../src/services/catalog.js';
import {
  carAddon,
  getPromoByCode,
  getPromoRemaining,
  savePromo,
  syncPromoUsage,
} from '../src/services/pricing.js';
import {
  checkInDirect,
  moveTenant,
  saveBooking,
} from '../src/services/property.js';

function fresh() {
  replaceState(buildSeedState());
}

const guest = {
  name: 'Budi Santoso',
  phone: '081234567890',
  email: 'budi@example.com',
  periode: '1',
  startDate: '2026-11-01',
  depositEnabled: false,
  payOption: 'partial',
};

test('booking records the guest email and the car surcharge', () => {
  fresh();
  const room = saveBooking(1, { ...guest, car: true, promo: null });

  assert.equal(room.booking.email, 'budi@example.com');
  assert.ok(
    room.booking.addons.some(
      (addon) => addon.name === 'Parkir Mobil' && addon.price === 130_000,
    ),
  );
  assert.equal(room.booking.addonTotal, 130_000);
  assert.equal(room.booking.grandTotal, 2_200_000 + 130_000);
  assert.equal(carAddon().price, 130_000);
});

test('landing promo code is applied to a booking', () => {
  fresh();
  const promo = getPromoByCode('mahasiswa5');
  assert.ok(promo);

  const room = saveBooking(2, { ...guest, car: true, promo });
  assert.equal(room.booking.promoId, promo.id);
  assert.equal(room.booking.discount, 110_000); // 5% of Rp2.200.000
  assert.equal(room.booking.grandTotal, 2_200_000 - 110_000 + 130_000);
});

test('promo codes are unique and usage quota can be synced from the server', () => {
  fresh();
  assert.throws(
    () => savePromo({ name: 'Duplikat', code: 'MAHASISWA5', type: 'rupiah', value: 10_000 }),
    /sudah dipakai/,
  );

  savePromo({ name: 'Sekali Pakai', code: 'sekali-1', type: 'persen', value: 10, maxUses: 1 });
  const promo = getPromoByCode('SEKALI-1');
  assert.equal(promo.maxUses, 1);
  assert.equal(getPromoRemaining(promo), 1);

  syncPromoUsage([{ code: 'SEKALI-1', maxUses: 1, usedCount: 1 }]);
  assert.equal(getPromoRemaining(getPromoByCode('SEKALI-1')), 0);
});

test('moving a tenant closes the old stay and starts a new history entry', () => {
  fresh();
  const tenant = checkInDirect(1, { ...guest, payOption: 'full' });
  moveTenant(tenant.id, 2, '2026-12-01');

  const updated = getState().tenants.find((item) => item.id === tenant.id);
  assert.equal(updated.roomNumber, '202');
  assert.equal(updated.stayHistory.length, 2);
  assert.equal(updated.stayHistory[0].to, '2026-12-01');
  assert.equal(updated.stayHistory[1].from, '2026-12-01');
  assert.equal(updated.stayHistory[1].to, null);
});

test('manual invoice supports tenant and non-tenant targets', () => {
  fresh();
  const tenant = checkInDirect(1, { ...guest, payOption: 'full' });
  moveTenant(tenant.id, 5, '2026-11-02');

  const tenantInvoice = createManualInvoice({
    mode: 'tenant',
    tenantId: tenant.id,
    roomId: 5,
    item: 'Perbaikan kunci',
    amount: 100_000,
    date: '2026-11-05',
  });
  assert.equal(tenantInvoice.mode, 'tenant');
  assert.equal(tenantInvoice.tenantId, tenant.id);
  assert.equal(tenantInvoice.tenantName, 'Budi Santoso');
  assert.equal(tenantInvoice.email, 'budi@example.com');
  assert.equal(tenantInvoice.roomNumber, '205');
  assert.equal(tenantInvoice.dueDate, '2026-11-05');

  const publicInvoice = createManualInvoice({
    mode: 'non-tenant',
    name: 'Laundry Budi',
    email: 'laundry@example.com',
    item: 'Laundry 5 Kg',
    amount: 50_000,
    date: '2026-11-06',
  });
  assert.equal(publicInvoice.mode, 'non-tenant');
  assert.equal(publicInvoice.tenantId, null);
  assert.equal(publicInvoice.roomNumber, '—');
  assert.equal(publicInvoice.email, 'laundry@example.com');
});

test('catalog publishes gallery, promo codes, and availability without local photos', () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    gallery: [
      {
        id: 1,
        caption: 'Kamar Deluxe',
        photo: 'data:image/jpeg;base64,abc',
        photoUrl: '',
      },
    ],
  });

  const local = buildCatalogSnapshot({ includeLocalPhotos: true });
  assert.equal(local.gallery.length, 1);
  assert.equal(local.gallery[0].url.startsWith('data:image/'), true);
  assert.equal(local.availability.total, 42);
  assert.ok(local.promos.some((promo) => promo.code === 'MAHASISWA5'));

  const published = buildCatalogSnapshot();
  assert.equal(published.gallery[0].url, '');
  assert.equal(JSON.stringify(published).includes('data:image/'), false);
});
