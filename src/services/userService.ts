import api from './api';
import { User } from '../types';

const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (user: { name: string; email: string }): Promise<User> => {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

  update: async (id: string, user: { name: string; email: string }): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default userService;
