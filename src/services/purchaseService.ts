import api from './api';
import { Purchase, PurchaseRequest } from '../types';

const purchaseService = {
  getAll: async (userId?: string): Promise<Purchase[]> => {
    const params = userId ? { userId } : {};
    const response = await api.get<Purchase[]>('/purchases', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Purchase> => {
    const response = await api.get<Purchase>(`/purchases/${id}`);
    return response.data;
  },

  create: async (purchase: PurchaseRequest): Promise<Purchase> => {
    const response = await api.post<Purchase>('/purchases', purchase);
    return response.data;
  },

  update: async (id: string, purchase: PurchaseRequest): Promise<Purchase> => {
    const response = await api.put<Purchase>(`/purchases/${id}`, purchase);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/purchases/${id}`);
  },
};

export default purchaseService;
