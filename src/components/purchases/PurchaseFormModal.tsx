import React, { useState, useEffect } from 'react';
import { PurchaseRequest, User, Category, PaymentMethod, FinancialInstitution, ExpenseType, Scope } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchase: PurchaseRequest) => void;
  users: User[];
  categories: Category[];
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'DEBIT_CARD', label: 'Tarjeta Débito' },
  { value: 'CREDIT_CARD', label: 'Tarjeta Crédito' },
  { value: 'BANK_TRANSFER', label: 'Transferencia' },
];

const FINANCIAL_INSTITUTIONS: { value: FinancialInstitution; label: string }[] = [
  { value: 'BANCO_DE_CHILE', label: 'Banco de Chile' },
  { value: 'BANCO_ESTADO', label: 'BancoEstado' },
  { value: 'BANCO_SANTANDER', label: 'Santander' },
  { value: 'BANCO_BCI', label: 'BCI' },
  { value: 'OTRO', label: 'Otro' },
];

const EXPENSE_TYPES: { value: ExpenseType; label: string }[] = [
  { value: 'FIXED', label: 'Fijo' },
  { value: 'VARIABLE', label: 'Variable' },
];

const SCOPES: { value: Scope; label: string }[] = [
  { value: 'HOME', label: 'Hogar' },
  { value: 'OUTING', label: 'Salida' },
  { value: 'PERSONAL', label: 'Personal' },
];

export const PurchaseFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, users, categories }) => {
  const [userId, setUserId] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [financialInstitution, setFinancialInstitution] = useState<FinancialInstitution>('BANCO_DE_CHILE');
  const [installmentCount, setInstallmentCount] = useState(1);
  const [expenseType, setExpenseType] = useState<ExpenseType>('VARIABLE');
  const [scope, setScope] = useState<Scope>('HOME');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (users.length > 0 && !userId) {
      setUserId(users[0].id);
    }
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [users, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      userId,
      totalAmount,
      purchaseDate,
      paymentMethod,
      financialInstitution,
      installmentCount,
      expenseType,
      scope,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg text-white shadow-2xl my-8">
        <h3 className="text-xl font-bold mb-4">Nueva Compra</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Usuario</label>
              <select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500" required>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500" required>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monto Total</label>
              <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500" min="1" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Fecha</label>
              <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Método de Pago</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500">
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.value} value={pm.value}>{pm.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Institución Financiera</label>
              <select value={financialInstitution} onChange={(e) => setFinancialInstitution(e.target.value as FinancialInstitution)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500">
                {FINANCIAL_INSTITUTIONS.map((fi) => (
                  <option key={fi.value} value={fi.value}>{fi.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cuotas</label>
              <input type="number" value={installmentCount} onChange={(e) => setInstallmentCount(Number(e.target.value))} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500" min="1" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tipo</label>
              <select value={expenseType} onChange={(e) => setExpenseType(e.target.value as ExpenseType)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500">
                {EXPENSE_TYPES.map((et) => (
                  <option key={et.value} value={et.value}>{et.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Alcance</label>
              <select value={scope} onChange={(e) => setScope(e.target.value as Scope)} className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500">
                {SCOPES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {installmentCount > 1 && (
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400">
                Cuota mensual: <span className="text-cyan-400 font-bold">${(totalAmount / installmentCount).toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold rounded-xl text-white shadow-lg shadow-cyan-500/20">
              Registrar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
