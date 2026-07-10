import axiosClient from './axiosClient';

const assumptionApi = {
  getAssumptions: async (params = {}) => {
    const { data } = await axiosClient.get('/assumptions', { params });
    return data;
  },

  getAssumptionById: async (id) => {
    const { data } = await axiosClient.get(`/assumptions/${id}`);
    return data;
  },

  createAssumption: async (payload) => {
    const { data } = await axiosClient.post('/assumptions', payload);
    return data;
  },

  updateAssumption: async (id, payload) => {
    const { data } = await axiosClient.put(`/assumptions/${id}`, payload);
    return data;
  },

  deleteAssumption: async (id) => {
    const { data } = await axiosClient.delete(`/assumptions/${id}`);
    return data;
  },
};

export default assumptionApi;