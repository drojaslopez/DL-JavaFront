import React, { useState } from 'react';
import { User } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: { name: string; email: string }) => void;
  user?: User | null;
}

export const UserFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email });
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md text-white shadow-2xl">
        <h3 className="text-xl font-bold mb-4">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold rounded-xl text-white shadow-lg shadow-cyan-500/20">
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
