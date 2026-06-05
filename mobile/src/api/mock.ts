export const MOCK_USER = {
  id: 'u1',
  phone: '+9779841234567',
  name: 'Siddhartha Thapa',
  bio: 'Engineering student at IOE. Believer in community support.',
  avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8WwWQd5tr4fUiuaNuevdCggJX0_jHrC_SbnLtf9Y-4JGIowahUALhMAvkITkqFuYxjVbEb2KKJWeyFtocMbHqzEg4pi8mG4jwEgcp1ukyFpAdgDo-OcNlbA47WO_KhWitO34YfyhQn31k0RA1JM1RxugYTr7PVG_EPpcFROuTh0aOrptcT0aWsgX3kQwuDW7K8r12XXot4KJJCkCB79sb23xCyKdG7Ac9OdXHVGQqvLSTi_ZyIjXwNYdJVWuHUpIi6HAan_u6TGI',
  kyc_status: 'verified',
  is_driver: true,
  balance: 545,
};

export const MOCK_RIDES = [
  {
    id: 'r1',
    driver_name: 'Binod Thapa',
    vehicle_details: 'Suzuki Gixxer • Blue',
    origin: 'Koteshwor',
    destination: 'Thapathali',
    seats_left: 1,
    cost: 45,
    departure_time: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'r2',
    driver_name: 'Anjali Rai',
    vehicle_details: 'Honda Dio • White',
    origin: 'Baneshwor',
    destination: 'Tripureshwar',
    seats_left: 1,
    cost: 30,
    departure_time: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
  }
];

export const MOCK_REQUESTS = [
  {
    request_id: 'rq1',
    passenger_name: 'Aayush Shrestha',
    seats_requested: 1,
    mutual_friends: 4,
    pickup_location: 'Thapathali Gate',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8WwWQd5tr4fUiuaNuevdCggJX0_jHrC_SbnLtf9Y-4JGIowahUALhMAvkITkqFuYxjVbEb2KKJWeyFtocMbHqzEg4pi8mG4jwEgcp1ukyFpAdgDo-OcNlbA47WO_KhWitO34YfyhQn31k0RA1JM1RxugYTr7PVG_EPpcFROuTh0aOrptcT0aWsgX3kQwuDW7K8r12XXot4KJJCkCB79sb23xCyKdG7Ac9OdXHVGQqvLSTi_ZyIjXwNYdJVWuHUpIi6HAan_u6TGI'
  }
];

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    sendOtp: async (phone: string) => {
      await delay(800);
      return { success: true };
    },
    verifyOtp: async (phone: string, otp: string) => {
      await delay(1000);
      return {
        access_token: 'mock_jwt_token',
        user_status: 'verified'
      };
    }
  },
  user: {
    getMe: async () => {
      await delay(500);
      return MOCK_USER;
    },
    updateProfile: async (data: any) => {
      await delay(800);
      return { ...MOCK_USER, ...data };
    }
  },
  kyc: {
    submit: async (data: any) => {
      await delay(1500);
      return { success: true, message: 'Submitted for manual review' };
    }
  },
  rides: {
    discover: async () => {
      await delay(600);
      return MOCK_RIDES;
    },
    requestSeat: async (rideId: string) => {
      await delay(1000);
      return { success: true };
    },
    getRequests: async (rideId: string) => {
      await delay(500);
      return MOCK_REQUESTS;
    }
  }
};
