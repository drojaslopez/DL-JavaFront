import React, { useEffect, useState } from 'react';
import { Purchase, User, Category } from '../types';
import purchaseService from '../services/purchaseService';
import userService from '../services/userService';
import categoryService from '../services/categoryService';
import { PurchaseFormModal } from '../components/purchases/PurchaseFormModal';

export const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [purchasesData, usersData, categoriesData] = await Promise.all([
        purchaseService.getAll(filterUserId || undefined),
        userService.getAll(),
        categoryService.getAll(),
      ]);
      setPurchases(purchasesData);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Error al cargar datos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterUserId]);

  const handleCreate = async (purchase: any) => {
    try {
      await purchaseService.create(purchase);
      loadData();
    } catch (err) {
      setError('Error al registrar compra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta compra?')) return;
    try {
      await purchaseService.delete(id);
      loadData();
    } catch (err) {
      setError('Error al eliminar compra');
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Desconocido';
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const paymentMethodLabels: Record<string, string> = {
    CASH: 'Efectivo',
    DEBIT_CARD: 'Débito',
    CREDIT_CARD: 'Crédito',
    BANK_TRANSFER: 'Transferencia',
  };

  const scopeLabels: Record<string, string> = {
    HOME: 'Hogar',
    OUTING: 'Salida',
    PERSONAL: 'Personal',
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-slate-400 text-lg">Cargando compras...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Compras</h2>
          <p className="text-sm text-slate-400 mt-1">{purchases.length} compras registradas</p>
        </div>
        <div className="flex gap-3">
          <select value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500">
            <option value="">Todos los usuarios</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/20">
            + Nueva Compra
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      <div className="space-y-3">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-800/20" onClick={() => toggleExpand(purchase.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-sm">
                  {purchase.expenseType === 'FIXED' ? '📌' : '🛒'}
                </div>
                <div>
                  <p className="font-semibold text-slate-200">{getUserName(purchase.userId)} - {purchase.category}</p>
                  <p className="text-xs text-slate-400">
                    {purchase.purchaseDate} · {paymentMethodLabels[purchase.paymentMethod]} · {scopeLabels[purchase.scope]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-slate-100">${purchase.totalAmount.toLocaleString()}</span>
                <span className="text-xs text-slate-500">{purchase.installmentCount} cuota{purchase.installmentCount > 1 ? 's' : ''}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(purchase.id); }} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400">
                  Eliminar
                </button>
              </div>
            </div>
            {expandedId === purchase.id && purchase.installments && (
              <div className="px-5 pb-5 border-t border-slate-800">
                <h5 className="text-sm font-semibold text-slate-400 mt-3 mb-2">Cuotas</h5>
                <div className="space-y-2">
                  {purchase.installments.map((inst) => (
                    <div key={inst.number} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl">
                      <span className="text-sm text-slate-300">Cuota {inst.number} - {inst.period}</span>
                      <span className="font-semibold text-slate-200">${inst.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <PurchaseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        users={users}
        categories={categories}
      />
    </div>
  );
};
