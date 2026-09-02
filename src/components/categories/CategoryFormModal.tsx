import React, { useState } from 'react';
import { Category } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: { name: string }) => void;
  category?: Category | null;
}

export const CategoryFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState(category?.name || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md text-white shadow-2xl">
        <h3 className="text-xl font-bold mb-4">{category ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej: Supermercado"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Se guardará en mayúsculas automáticamente</p>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold rounded-xl text-white shadow-lg shadow-cyan-500/20">
              {category ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
