import axiosClient from './axiosClient';

const aiApi = {
  getInsights: async (params = {}) => {
    const { data } = await axiosClient.get('/insights', { params });
    return data;
  },

  generateInsight: async (payload) => {
    const { data } = await axiosClient.post('/insights/generate', payload);
    return data;
  },

  createInsight: async (payload) => {
    const { data } = await axiosClient.post('/insights', payload);
    return data;
  },
};

export default aiApi;