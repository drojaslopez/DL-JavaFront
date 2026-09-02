import React, { useEffect, useState } from 'react';
import { Category } from '../types';
import categoryService from '../services/categoryService';
import { CategoryFormModal } from '../components/categories/CategoryFormModal';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Error al cargar categorías. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (category: { name: string }) => {
    try {
      await categoryService.create(category);
      loadCategories();
    } catch (err) {
      setError('Error al crear categoría');
    }
  };

  const handleUpdate = async (category: { name: string }) => {
    if (!editingCategory) return;
    try {
      await categoryService.update(editingCategory.id, category);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      setError('Error al actualizar categoría');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoryService.delete(id);
      loadCategories();
    } catch (err) {
      setError('Error al eliminar categoría');
    }
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-slate-400 text-lg">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
          <p className="text-sm text-slate-400 mt-1">{categories.length} categorías registradas</p>
        </div>
        <button onClick={openCreate} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/20">
          + Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-semibold">
                {category.name}
              </span>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => openEdit(category)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
                Editar
              </button>
              <button onClick={() => handleDelete(category.id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingCategory ? handleUpdate : handleCreate}
        category={editingCategory}
      />
    </div>
  );
};
