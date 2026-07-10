import axiosClient from './axiosClient';

const authApi = {
  register: async (payload) => {
    const { data } = await axiosClient.post('/auth/register', payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await axiosClient.post('/auth/login', payload);
    return data;
  },

  logout: async () => {
    const { data } = await axiosClient.post('/auth/logout');
    return data;
  },

  getProfile: async () => {
    const { data } = await axiosClient.get('/auth/profile');
    return data;
  },

  refreshToken: async (payload) => {
    const { data } = await axiosClient.post('/auth/refresh-token', payload);
    return data;
  },
};

export default authApi;