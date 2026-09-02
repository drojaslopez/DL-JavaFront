import React, { useEffect, useState } from 'react';
import { User } from '../types';
import userService from '../services/userService';
import { UserFormModal } from '../components/users/UserFormModal';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (user: { name: string; email: string }) => {
    try {
      await userService.create(user);
      loadUsers();
    } catch (err) {
      setError('Error al crear usuario');
    }
  };

  const handleUpdate = async (user: { name: string; email: string }) => {
    if (!editingUser) return;
    try {
      await userService.update(editingUser.id, user);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError('Error al actualizar usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de desactivar este usuario?')) return;
    try {
      await userService.delete(id);
      loadUsers();
    } catch (err) {
      setError('Error al desactivar usuario');
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-slate-400 text-lg">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-sm text-slate-400 mt-1">{users.length} usuarios registrados</p>
        </div>
        <button onClick={openCreate} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/20">
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Nombre</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Estado</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEdit(user)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400">
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingUser ? handleUpdate : handleCreate}
        user={editingUser}
      />
    </div>
  );
};
