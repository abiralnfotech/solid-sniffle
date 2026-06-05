import { mockApi } from './mock';

// Toggle this to use real API when ready
const USE_MOCK = true;

export const apiClient = USE_MOCK ? mockApi : {
  // Real implementation would go here using fetch or axios
  auth: {
    sendOtp: async (phone: string) => { /* ... */ },
    verifyOtp: async (phone: string, otp: string) => { /* ... */ },
  },
  user: {
    getMe: async () => { /* ... */ },
    updateProfile: async (data: any) => { /* ... */ },
  },
  kyc: {
    submit: async (data: any) => { /* ... */ },
  },
  rides: {
    discover: async () => { /* ... */ },
    requestSeat: async (rideId: string) => { /* ... */ },
    getRequests: async (rideId: string) => { /* ... */ },
  }
};
