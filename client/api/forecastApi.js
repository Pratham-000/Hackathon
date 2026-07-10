import axiosClient from './axiosClient';

const forecastApi = {
  getForecasts: async (params = {}) => {
    const { data } = await axiosClient.get('/forecasts', { params });
    return data;
  },

  getForecastById: async (id) => {
    const { data } = await axiosClient.get(`/forecasts/${id}`);
    return data;
  },

  createForecast: async (payload) => {
    const { data } = await axiosClient.post('/forecasts', payload);
    return data;
  },

  updateForecast: async (id, payload) => {
    const { data } = await axiosClient.put(`/forecasts/${id}`, payload);
    return data;
  },

  deleteForecast: async (id) => {
    const { data } = await axiosClient.delete(`/forecasts/${id}`);
    return data;
  },

  runForecast: async (payload) => {
    const { data } = await axiosClient.post('/forecasts/run', payload);
    return data;
  },
};

export default forecastApi;