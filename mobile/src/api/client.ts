import axios from 'axios';
import { mockApi } from './mock';

const USE_MOCK = false;

// In a real Expo app, this would be your local IP or production URL
const BASE_URL = 'http://127.0.0.1:8000/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
});

let authToken: string | null = null;

instance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const apiClient = USE_MOCK ? mockApi : {
  requestOtp: async (phone: string) => {
    const response = await instance.post('/auth/request-otp', { phone_number: phone });
    return response.data;
  },
  verifyOtp: async (phone: string, otp: string) => {
    const response = await instance.post('/auth/verify-otp', { phone_number: phone, otp });
    authToken = response.data.access_token;
    return response.data;
  },
  getUser: async () => {
    const response = await instance.get('/users/me');
    return response.data;
  },
  getRides: async () => {
    const response = await instance.get('/rides/search', {
        params: {
            pickup_lat: 27.7,
            pickup_lng: 85.3,
            dropoff_lat: 27.71,
            dropoff_lng: 85.32
        }
    });
    return response.data;
  },
  getRequests: async () => {
    // Hardcoded ride ID for demo purposes
    const rideId = '00000000-0000-0000-0000-000000000001';
    const response = await instance.get(`/rides/${rideId}/requests`);
    return response.data;
  },
  submitKyc: async (formData: FormData) => {
    const response = await instance.post('/kyc/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getKycStatus: async () => {
    const response = await instance.get('/kyc/status');
    return response.data;
  },
  submitFeedback: async (rideId: string, feedback: any) => {
    const response = await instance.post(`/rides/${rideId}/feedback`, feedback);
    return response.data;
  },
  getStatus: async () => {
    const response = await instance.get('/users/status');
    return response.data;
  },
};
