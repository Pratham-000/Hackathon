import axiosClient from './axiosClient';

const dashboardApi = {
  getOverview: async (params = {}) => {
    const { data } = await axiosClient.get('/dashboard', { params });
    return data;
  },

  getKpis: async (params = {}) => {
    const { data } = await axiosClient.get('/dashboard/kpis', { params });
    return data;
  },

  getSummary: async (params = {}) => {
    const { data } = await axiosClient.get('/dashboard/summary', { params });
    return data;
  },

  getTrends: async (params = {}) => {
    const { data } = await axiosClient.get('/dashboard/trends', { params });
    return data;
  },
};

export default dashboardApi;