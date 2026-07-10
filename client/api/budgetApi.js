import axiosClient from './axiosClient';

const budgetApi = {
  getBudgets: async (params = {}) => {
    const { data } = await axiosClient.get('/budgets', { params });
    return data;
  },

  getBudgetById: async (id) => {
    const { data } = await axiosClient.get(`/budgets/${id}`);
    return data;
  },

  createBudget: async (payload) => {
    const { data } = await axiosClient.post('/budgets', payload);
    return data;
  },

  updateBudget: async (id, payload) => {
    const { data } = await axiosClient.put(`/budgets/${id}`, payload);
    return data;
  },

  deleteBudget: async (id) => {
    const { data } = await axiosClient.delete(`/budgets/${id}`);
    return data;
  },

  duplicateBudget: async (id) => {
    const { data } = await axiosClient.post(`/budgets/${id}/duplicate`);
    return data;
  },

  publishBudget: async (id) => {
    const { data } = await axiosClient.patch(`/budgets/${id}/publish`);
    return data;
  },
};

export default budgetApi;