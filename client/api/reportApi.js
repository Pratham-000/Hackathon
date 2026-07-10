import axiosClient from './axiosClient';

const reportApi = {
  getReports: async (params = {}) => {
    const { data } = await axiosClient.get('/reports', { params });
    return data;
  },

  getReportById: async (id) => {
    const { data } = await axiosClient.get(`/reports/${id}`);
    return data;
  },

  createReport: async (payload) => {
    const { data } = await axiosClient.post('/reports', payload);
    return data;
  },

  updateReport: async (id, payload) => {
    const { data } = await axiosClient.put(`/reports/${id}`, payload);
    return data;
  },

  deleteReport: async (id) => {
    const { data } = await axiosClient.delete(`/reports/${id}`);
    return data;
  },

  exportReport: async (id, format = 'pdf') => {
    const { data } = await axiosClient.get(`/reports/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return data;
  },
};

export default reportApi;