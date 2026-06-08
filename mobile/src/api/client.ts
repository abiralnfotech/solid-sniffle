import { mockApi } from './mock';

const USE_MOCK = true;

export const apiClient = USE_MOCK ? mockApi : {
  // Real API implementation would go here
  requestOtp: async (phone: string) => { throw new Error('Not implemented'); },
  verifyOtp: async (phone: string, otp: string) => { throw new Error('Not implemented'); },
  getUser: async () => { throw new Error('Not implemented'); },
  getRides: async () => { throw new Error('Not implemented'); },
  getRequests: async () => { throw new Error('Not implemented'); },
  submitKyc: async () => { throw new Error('Not implemented'); },
  getKycStatus: async () => { throw new Error('Not implemented'); },
  submitFeedback: async () => { throw new Error('Not implemented'); },
  getStatus: async () => { throw new Error('Not implemented'); },
};
