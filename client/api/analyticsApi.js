import axiosClient from './axiosClient';

const analyticsApi = {
  getAnalyticsOverview: async (params = {}) => {
    const { data } = await axiosClient.get('/analytics', { params });
    return data;
  },

  getRevenueAnalytics: async (params = {}) => {
    const { data } = await axiosClient.get('/analytics/revenue', { params });
    return data;
  },

  getMarginAnalytics: async (params = {}) => {
    const { data } = await axiosClient.get('/analytics/margin', { params });
    return data;
  },

  getCostBreakdown: async (params = {}) => {
    const { data } = await axiosClient.get('/analytics/cost-breakdown', { params });
    return data;
  },

  getScenarioAnalytics: async (params = {}) => {
    const { data } = await axiosClient.get('/analytics/scenarios', { params });
    return data;
  },
};

export default analyticsApi;