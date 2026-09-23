import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('grocery_tracker_user') || 'null');
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    return config;
});

API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('grocery_tracker_user');
            window.dispatchEvent(new Event('auth-expired'));
        }
        return Promise.reject(error);
    }
);

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export const getTrips = () => API.get('/trips');
export const getTrip = (id) => API.get(`/trips/${id}`);
export const createTrip = (tripData) => API.post('/trips', tripData);
export const deleteTrip = (id) => API.delete(`/trips/${id}`);

export const addItem = (tripId, itemData) => API.post(`/trips/${tripId}/items`, itemData);
export const updateItem = (tripId, itemId, itemData) => API.put(`/trips/${tripId}/items/${itemId}`, itemData);
export const deleteItem = (tripId, itemId) => API.delete(`/trips/${tripId}/items/${itemId}`);

export const getCategoryStats = () => API.get('/reports/category-stats');
export const getMonthlyStats = () => API.get('/reports/monthly-stats');
export const getSummary = () => API.get('/reports/summary');

export default API;
