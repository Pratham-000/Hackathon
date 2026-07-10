import axiosClient from './axiosClient';

const employeeApi = {
  getEmployees: async (params = {}) => {
    const { data } = await axiosClient.get('/employees', { params });
    return data;
  },

  getEmployeeById: async (id) => {
    const { data } = await axiosClient.get(`/employees/${id}`);
    return data;
  },

  createEmployee: async (payload) => {
    const { data } = await axiosClient.post('/employees', payload);
    return data;
  },

  updateEmployee: async (id, payload) => {
    const { data } = await axiosClient.put(`/employees/${id}`, payload);
    return data;
  },

  deleteEmployee: async (id) => {
    const { data } = await axiosClient.delete(`/employees/${id}`);
    return data;
  },

  getEmployeeStats: async (params = {}) => {
    const { data } = await axiosClient.get('/employees/stats', { params });
    return data;
  },
};

export default employeeApi;