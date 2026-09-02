import api from './api';
import { DashboardResponse, ProjectionResponse } from '../types';

const reportService = {
  getDashboard: async (month: number, year: number): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>('/reports/dashboard', {
      params: { month, year },
    });
    return response.data;
  },

  getProjection: async (months: number): Promise<ProjectionResponse> => {
    const response = await api.get<ProjectionResponse>('/reports/projection', {
      params: { months },
    });
    return response.data;
  },
};

export default reportService;
