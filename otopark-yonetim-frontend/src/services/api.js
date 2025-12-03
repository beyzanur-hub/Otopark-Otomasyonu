import axios from 'axios';

// Eğer canlıdaysak Render adresini, değilsek localhost'u kullan
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://senin-backend-isin-buraya-gelecek.onrender.com' // <-- Bunu deploy edince güncelleyeceğiz
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;