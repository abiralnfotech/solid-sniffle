import Constants from 'expo-constants';
import * as apiTypes from '../types/api';

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0] || 'localhost';
  return `http://${localhost}:8000`;
};

const BASE_URL = getBaseUrl();
const API_V1 = `${BASE_URL}/api/v1`;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_V1}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  health: () => fetch(`${BASE_URL}/health`).then(r => r.json()),

  users: {
    create: (data: apiTypes.UserCreate) =>
      request<apiTypes.UserRead>('/users/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (userId: string) =>
      request<apiTypes.UserRead>(`/users/${userId}`),
  },

  kyc: {
    submit: (userId: string, data: apiTypes.KYCCreate) =>
      request<apiTypes.KYCRead>(`/kyc/?user_id=${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  routes: {
    create: (driverId: string, data: apiTypes.RouteCreate) =>
      request<apiTypes.RouteRead>(`/routes/?driver_id=${driverId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    search: (lon: number, lat: number, radius: number = 5000) =>
      request<apiTypes.RouteRead[]>(`/routes/search?lon=${lon}&lat=${lat}&radius=${radius}`),
  },

  rides: {
    get: (rideId: string) =>
      request<apiTypes.RideRead>(`/rides/${rideId}`),
    request: (passengerId: string, data: apiTypes.RideCreate) =>
      request<apiTypes.RideRead>(`/rides/?passenger_id=${passengerId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    accept: (rideId: string, driverId: string) =>
      request<apiTypes.RideRead>(`/rides/${rideId}/accept?driver_id=${driverId}`, {
        method: 'POST',
      }),
    start: (rideId: string, driverId: string) =>
      request<apiTypes.RideRead>(`/rides/${rideId}/start?driver_id=${driverId}`, {
        method: 'POST',
      }),
    end: (rideId: string, driverId: string) =>
      request<apiTypes.RideRead>(`/rides/${rideId}/end?driver_id=${driverId}`, {
        method: 'POST',
      }),
    confirm: (rideId: string, passengerId: string) =>
      request<apiTypes.RideRead>(`/rides/${rideId}/confirm?passenger_id=${passengerId}`, {
        method: 'POST',
      }),
  },

  credits: {
    getBalance: (userId: string) =>
      request<apiTypes.CreditBalance>(`/credits/balance?user_id=${userId}`),
    getHistory: (userId: string) =>
      request<apiTypes.CreditLedgerRead[]>(`/credits/history?user_id=${userId}`),
  },

  feedback: {
    submit: (reviewerId: string, data: apiTypes.RideReviewCreate) =>
      request<apiTypes.RideReviewRead>(`/feedback/?reviewer_id=${reviewerId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  location: {
    update: (driverId: string, data: apiTypes.LocationUpdateCreate) =>
      request<apiTypes.LocationUpdateRead>(`/location/update?driver_id=${driverId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getLatest: (rideId: string) =>
      request<apiTypes.LocationUpdateRead>(`/location/${rideId}/latest`),
    triggerSos: (userId: string, data: apiTypes.SOSAlertCreate) =>
      request<apiTypes.SOSAlertRead>(`/location/sos?user_id=${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
