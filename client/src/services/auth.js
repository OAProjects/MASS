// src/services/auth.js

import axios from 'axios';

const AuthService = {
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },
  
  setToken(token) {
    localStorage.setItem('token', token);
  },
  
  getToken() {
    return localStorage.getItem('token');
  },
  
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  fetchUserDetails() {
    const token = this.getToken();
    return axios.get('http://localhost:3000/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default AuthService;
