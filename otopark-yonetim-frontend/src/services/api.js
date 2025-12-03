import axios from 'axios';

// Canlıdaysak Render adresini, değilsek Localhost'u kullan
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://otopark-backend.onrender.com' // <-- BURAYA KENDİ RENDER LİNKİNİ YAPIŞTIR (sonunda /api OLMASIN)
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;