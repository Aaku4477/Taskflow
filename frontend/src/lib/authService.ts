import { api } from './api';
import { AuthResponse, User } from '@/types';

export const authService = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },
};
