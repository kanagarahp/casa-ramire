import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_DEPOSIT } from '../src/core/constants.js';
import { buildSeedState } from '../src/core/seed.js';
import { getState, replaceState } from '../src/core/store.js';
import {
  getDepositAccount,
  getDepositAccounts,
  getDepositSummary,
  refundDeposit,
  setDepositPaid,
} from '../src/services/deposit.js';
import { getLedgerEntries, getLedgerSummary } from '../src/services/ledger.js';
import {
  checkInFromBooking,
  checkInDirect,
  checkoutTenant,
  saveBooking,
} from '../src/services/property.js';
import { getProfitLoss } from '../src/services/reports.js';

function fresh() {
  replaceState(buildSeedState());
}

const guest = {
  name: 'Lita',
  phone: '081234567891',
  email: 'lita@example.com',
  periode: '1',
  startDate: '2026-11-01',
  depositEnabled: true,
  depositValue: DEFAULT_DEPOSIT,
};

test('deposit is cash held but not revenue, and refund is recorded as cash out', () => {
  fresh();
  const tenant = checkInDirect(1, {
    ...guest,
    depositPaidNow: true,
    payOption: 'partial',
  });

  assert.equal(tenant.depositPaid, DEFAULT_DEPOSIT);
  assert.equal(tenant.depositRefunded, 0);
  assert.equal(tenant.depositHistory.length, 1);
  assert.equal(getDepositSummary().held, DEFAULT_DEPOSIT);
  assert.equal(getDepositSummary().outstanding, 0);

  const ledger = getLedgerEntries();
  assert.ok(ledger.some((entry) => entry.category === 'Deposit / Jaminan' && entry.amount === DEFAULT_DEPOSIT));
  assert.equal(getLedgerSummary().totalIn, DEFAULT_DEPOSIT);
  assert.equal(getLedgerSummary().depositHeld, DEFAULT_DEPOSIT);
  assert.equal(getLedgerSummary().operatingIn, 0);

  const pnl = getProfitLoss();
  assert.equal(pnl.revenue, tenant.monthlyCharge);
  assert.equal(pnl.revenue, 2_200_000);

  refundDeposit('tenant', tenant.id, 200_000, { note: 'Refund sebagian' });
  assert.equal(getDepositAccount('tenant', tenant.id).depositRefunded, 200_000);
  assert.equal(getDepositSummary().held, 300_000);
  assert.ok(
    getLedgerEntries().some(
      (entry) => entry.category === 'Refund Deposit' && entry.amount === 200_000,
    ),
  );

  // Historical deposit entries stay in the ledger after checkout so the cash
  // book does not lose the original receipt/refund.
  checkoutTenant(tenant.id, '2026-11-30');
  assert.ok(
    getLedgerEntries().some(
      (entry) => entry.category === 'Deposit / Jaminan' && entry.amount === DEFAULT_DEPOSIT,
    ),
  );
  assert.ok(
    getLedgerEntries().some(
      (entry) => entry.category === 'Refund Deposit' && entry.amount === 200_000,
    ),
  );
});

test('an unpaid deposit can be recorded later and corrected from the spreadsheet import', () => {
  fresh();
  const tenant = checkInDirect(1, {
    ...guest,
    depositPaidNow: false,
    payOption: 'partial',
  });

  assert.equal(tenant.depositPaid, 0);
  assert.equal(getDepositSummary().outstanding, DEFAULT_DEPOSIT);
  assert.equal(
    getLedgerEntries().some((entry) => entry.category === 'Deposit / Jaminan'),
    false,
  );

  setDepositPaid('tenant', tenant.id, DEFAULT_DEPOSIT, {
    method: 'Transfer Bank',
    note: 'Pelunasan deposit',
  });
  assert.equal(getDepositAccount('tenant', tenant.id).depositPaid, DEFAULT_DEPOSIT);
  assert.equal(getDepositSummary().outstanding, 0);
  assert.equal(getDepositSummary().held, DEFAULT_DEPOSIT);

  // Importing a corrected sheet can replace the synthetic history rather than
  // creating misleading in/out entries.
  setDepositPaid('tenant', tenant.id, 0, {
    method: 'Impor spreadsheet',
    replaceHistory: true,
  });
  assert.equal(getDepositAccount('tenant', tenant.id).depositPaid, 0);
  assert.equal(getDepositSummary().held, 0);
  assert.equal(
    getLedgerEntries().some((entry) => entry.category === 'Deposit / Jaminan'),
    false,
  );
});

test('booking deposit carries into the tenant when converted to check-in', () => {
  fresh();
  const room = saveBooking(1, {
    ...guest,
    depositPaidNow: true,
    payOption: 'partial',
  });

  assert.equal(room.booking.depositPaid, DEFAULT_DEPOSIT);
  const bookingAccount = getDepositAccounts().find((account) => account.kind === 'booking');
  assert.ok(bookingAccount);
  assert.equal(bookingAccount.depositPaid, DEFAULT_DEPOSIT);

  const tenant = checkInFromBooking(1, { settle: false });
  assert.equal(tenant.depositPaid, DEFAULT_DEPOSIT);
  assert.equal(tenant.depositHistory.length, 1);
  assert.equal(getState().rooms[0].booking, null);
});
