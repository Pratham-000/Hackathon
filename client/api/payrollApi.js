import axiosClient from './axiosClient';

const payrollApi = {
  getPayrolls: async (params = {}) => {
    const { data } = await axiosClient.get('/payroll', { params });
    return data;
  },

  getPayrollById: async (id) => {
    const { data } = await axiosClient.get(`/payroll/${id}`);
    return data;
  },

  createPayroll: async (payload) => {
    const { data } = await axiosClient.post('/payroll', payload);
    return data;
  },

  updatePayroll: async (id, payload) => {
    const { data } = await axiosClient.put(`/payroll/${id}`, payload);
    return data;
  },

  deletePayroll: async (id) => {
    const { data } = await axiosClient.delete(`/payroll/${id}`);
    return data;
  },

  getPayrollSummary: async (params = {}) => {
    const { data } = await axiosClient.get('/payroll/summary', { params });
    return data;
  },

  getPayrollByEmployee: async (employeeId, params = {}) => {
    const { data } = await axiosClient.get(`/payroll/employee/${employeeId}`, {
      params,
    });
    return data;
  },

  runPayroll: async (payload) => {
    const { data } = await axiosClient.post('/payroll/run', payload);
    return data;
  },

  approvePayroll: async (id) => {
    const { data } = await axiosClient.patch(`/payroll/${id}/approve`);
    return data;
  },
};

export default payrollApi;