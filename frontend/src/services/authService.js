// src/services/authService.js
// ============================================================
// Auth Service – Login, Register, token storage helpers.
// ============================================================

import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// Attach JWT on every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Request failed.';
    return Promise.reject(new Error(msg));
  }
);

export const loginRequest    = (email, password) =>
  API.post('/auth/login',    { email, password });

export const registerRequest = (name, email, password) =>
  API.post('/auth/register', { name, email, password });

export const getMeRequest    = () => API.get('/auth/me');

// ── Token helpers ───────────────────────────────────────────
export const saveToken   = (token) => localStorage.setItem('tf_token', token);
export const getToken    = ()      => localStorage.getItem('tf_token');
export const removeToken = ()      => localStorage.removeItem('tf_token');
export const saveUser    = (user)  => localStorage.setItem('tf_user', JSON.stringify(user));
export const getUser     = ()      => {
  try { return JSON.parse(localStorage.getItem('tf_user')); } catch { return null; }
};
export const removeUser  = ()      => localStorage.removeItem('tf_user');
