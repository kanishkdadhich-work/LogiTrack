import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true // IMPORTANT: Tells the browser to send cookies
});

export default api;
// This runs before every single request
