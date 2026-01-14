import axios from 'axios';

const API_BASE = 'http://localhost:4000'; // Change backend URL as needed

export default {
  auth: {
    login: (email, password) => axios.post(`${API_BASE}/auth/login`, { email, password }),
    register: (name, email, password, photo) => axios.post(`${API_BASE}/auth/register`, { name, email, password, photo }),
    profile: (email) => axios.get(`${API_BASE}/auth/profile/${encodeURIComponent(email)}`)
  },
  mountains: {
    list: () => axios.get(`${API_BASE}/mountains`),
    get: (slug) => axios.get(`${API_BASE}/mountains/${slug}`)
  },
  admin: {
    upgrade: (email) => axios.post(`${API_BASE}/admin/upgrade`, { email })
  }
};
