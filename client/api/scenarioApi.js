import axiosClient from './axiosClient';

const scenarioApi = {
  getScenarios: async (params = {}) => {
    const { data } = await axiosClient.get('/scenarios', { params });
    return data;
  },

  getScenarioById: async (id) => {
    const { data } = await axiosClient.get(`/scenarios/${id}`);
    return data;
  },

  createScenario: async (payload) => {
    const { data } = await axiosClient.post('/scenarios', payload);
    return data;
  },

  updateScenario: async (id, payload) => {
    const { data } = await axiosClient.put(`/scenarios/${id}`, payload);
    return data;
  },

  deleteScenario: async (id) => {
    const { data } = await axiosClient.delete(`/scenarios/${id}`);
    return data;
  },

  compareScenarios: async (payload) => {
    const { data } = await axiosClient.post('/scenarios/compare', payload);
    return data;
  },
};

export default scenarioApi;