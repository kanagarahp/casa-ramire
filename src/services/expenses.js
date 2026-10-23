import { nextId } from '../core/id.js';
import { isInMonth, toNumber, todayISO } from '../core/format.js';
import { getState, update } from '../core/store.js';

export function getExpenses() {
  return [...getState().expenses].sort((a, b) => {
    if (a.date !== b.date) return String(b.date).localeCompare(String(a.date));
    return b.id - a.id;
  });
}

export function getExpenseCategories() {
  return [...getState().expenseCategories];
}

export function addExpense({ date, category, description, amount }) {
  const cleanDescription = String(description || '').trim();
  const cleanCategory = String(category || '').trim();
  const value = Math.round(toNumber(amount));

  if (!cleanDescription) throw new Error('Deskripsi pengeluaran wajib diisi.');
  if (!cleanCategory) throw new Error('Kategori wajib dipilih.');
  if (value <= 0) throw new Error('Nominal pengeluaran harus lebih dari 0.');

  let created;
  update((draft) => {
    created = {
      id: nextId(draft.expenses),
      date: date || todayISO(),
      category: cleanCategory,
      description: cleanDescription,
      amount: value,
      createdAt: new Date().toISOString(),
    };
    draft.expenses.push(created);
  });
  return created;
}

export function updateExpense(id, payload) {
  const cleanDescription = String(payload.description || '').trim();
  const cleanCategory = String(payload.category || '').trim();
  const value = Math.round(toNumber(payload.amount));
  if (!cleanDescription) throw new Error('Deskripsi pengeluaran wajib diisi.');
  if (!cleanCategory) throw new Error('Kategori wajib dipilih.');
  if (value <= 0) throw new Error('Nominal pengeluaran harus lebih dari 0.');

  update((draft) => {
    const target = draft.expenses.find((item) => String(item.id) === String(id));
    if (!target) throw new Error('Pengeluaran tidak ditemukan.');
    target.date = payload.date || target.date;
    target.category = cleanCategory;
    target.description = cleanDescription;
    target.amount = value;
    target.updatedAt = new Date().toISOString();
  });
}

export function deleteExpense(id) {
  update((draft) => {
    draft.expenses = draft.expenses.filter((item) => String(item.id) !== String(id));
  });
}

export function addExpenseCategory(name) {
  const clean = String(name || '').trim();
  if (!clean) throw new Error('Nama kategori wajib diisi.');

  const state = getState();
  if (state.expenseCategories.some((category) => category.toLowerCase() === clean.toLowerCase())) {
    throw new Error('Kategori sudah ada.');
  }

  update((draft) => {
    draft.expenseCategories.push(clean);
  });
  return clean;
}

export function deleteExpenseCategory(name) {
  const state = getState();
  if (state.expenseCategories.length <= 1) throw new Error('Minimal harus ada satu kategori.');

  update((draft) => {
    draft.expenseCategories = draft.expenseCategories.filter((category) => category !== name);
  });
}

export function getMonthlyExpenseTotal(reference = new Date()) {
  return getState()
    .expenses.filter((expense) => isInMonth(expense.date, reference))
    .reduce((sum, expense) => sum + toNumber(expense.amount), 0);
}
