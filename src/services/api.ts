import axios from 'axios';
const API = 'https://dummyjson.com';

export const loginUser = async (username: string, password: string) => {
  const res = await axios.post(`${API}/auth/login`, { username, password });
  return res.data;
};

export const getMe = async (token: string) => {
  const res = await axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getProducts = async () => {
  const res = await axios.get(`${API}/products`);
  return res.data;
};

export const getCategoryProducts = async (category: string) => {
  const res = await axios.get(`${API}/products/category/${category}`);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await axios.delete(`${API}/products/${id}`);
  return res.data;
};
