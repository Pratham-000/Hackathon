import api from './axiosClient';

export const budgetApi = {
  getBudgets: (params = {}) => api.get('/budgets', { params }),
  getBudgetById: (id) => api.get(`/budgets/${id}`),
  createBudget: (payload) => api.post('/budgets', payload),
  updateBudget: (id, payload) => api.put(`/budgets/${id}`, payload),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
};

export default budgetApi;
