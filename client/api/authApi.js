import api from './axiosClient';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  getProfile: () => api.get('/auth/profile'),
};

export default authApi;
