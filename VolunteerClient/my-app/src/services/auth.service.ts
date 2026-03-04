import axios from './axios';
import { type RegisterType, type LoginType } from '../types/auth.types';
const url = 'auth';


export const register = async (user: RegisterType) => {
  const response = await axios.post(`${url}/register`, user);
  const data = response.data;
  return data;
};
export const login = async (credentials: LoginType) => {
  const response = await axios.post(`${url}/login`, credentials);
  const data = response.data;
  return data;
};

export const loginByToken = async (token: string) => {
  const response = await axios.get(`${url}/getUserByToken`, { headers: { Authorization: `Bearer ${token}` } });
  const data = response.data;
  return data;
};