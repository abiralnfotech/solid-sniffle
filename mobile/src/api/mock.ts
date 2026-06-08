export const MOCK_USER = {
  id: 'user-1',
  full_name: 'Binod Thapa',
  phone_number: '+9779812345678',
  profile_picture_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk6cbZzarvuja60iWNIGc3JVPGkQiZv_tKeTlJTQijxqv8q63M2ndEnlmbY6BHuCS-5KAyeM_BDRpODqcf7vZVfqHutF0ODIgO3s3sAxS6trlivuqVo2FKrqSMn5bRha8I3_KcqpwHY8akRZMCqkT5R_Bt8mwzAVanUIAYQ-pwR5OASyaSKLQyGrKO_P2WljW63Og2v8QvEtrgbiYSpSl3xUMxPMeBrlwFFzqG4SRTj9rrWl9RZYX-Bcj7rur1I6lXw5FOcdkXjBo',
  credit_balance: 500,
  is_verified: true,
  rating: 4.8,
};

export const MOCK_RIDES = [
  {
    ride_id: 'ride-1',
    driver_name: 'Binod Thapa',
    driver_rating: 4.8,
    vehicle_info: 'Suzuki Gixxer • Blue',
    available_seats: 1,
    goodwill_cost: 45,
    departure_time: new Date(Date.now() + 600000).toISOString(),
    pickup_distance: 0.5,
    driver_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLD14MsQG1FVepJu8XnfpNFEUTRaTPyEMSfK4scm2Q5Qewux5U8w3dgy2la0c2o224LQQpFFRrq6ot3xv8MyJMxVBuB06cLaK8FCYNXbo46DdTw6kJsE13INoTzZrRneI6hdJQX2iTuShKkmWcPDCvuOeSZhbnWbFpIdEyw4w1dHsr8OapD6dr2su77dYVk4_ss6SnZTzptceX40Mj5J3tIuLrkOXuyYMOkDXN4_VHNV3gz6saU6b-xcg-SHDi143FYdodh5hFImE',
    comment: 'Heading to Putalisadak via Bagbazar. Can drop anywhere on main road.'
  },
  {
    ride_id: 'ride-2',
    driver_name: 'Prerana KC',
    driver_rating: 4.9,
    vehicle_info: 'Vespa VXL • White',
    available_seats: 2,
    goodwill_cost: 30,
    departure_time: new Date(Date.now() + 120000).toISOString(),
    pickup_distance: 1.2,
    driver_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABcPR-t-RO9KUuDMyPdaVSxXuT7iCgpqsBF8mMZMbeesDHJjT1ulkQa9nfBwXBSdmOoNwQ81qk5rtAf06mUy_srYGG9J92xlEloeDqXhNadxxhqw2W1kqUawn20knBtCj7Afu9utdiyxcMvWCFxHUTzu6pinuNefLHtrEt0ty9fcdaVaLGPVHsUc960Vzzfcf4JdouLAmRfyYHrJHySwmAqT39IWZ8Lgyi2w3CxXxlz0rXqKbftYeTVKiDmiCYhwbzLt-JzO3U-q4',
    comment: 'Regular commute to New Baneshwor.'
  }
];

export const MOCK_RIDE_REQUESTS = [
  {
    request_id: 'req-1',
    passenger_name: 'Aayush Shrestha',
    passenger_rating: 4.5,
    mutual_friends: 4,
    seats_requested: 1,
    pickup_location: 'Thapathali Gate',
    status: 'pending',
    passenger_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8WwWQd5tr4fUiuaNuevdCggJX0_jHrC_SbnLtf9Y-4JGIowahUALhMAvkITkqFuYxjVbEb2KKJWeyFtocMbHqzEg4pi8mG4jwEgcp1ukyFpAdgDo-OcNlbA47WO_KhWitO34YfyhQn31k0RA1JM1RxugYTr7PVG_EPpcFROuTh0aOrptcT0aWsgX3kQwuDW7K8r12XXot4KJJCkCB79sb23xCyKdG7Ac9OdXHVGQqvLSTi_ZyIjXwNYdJVWuHUpIi6HAan_u6TGI',
    credit_offer: 50
  },
  {
    request_id: 'req-2',
    passenger_name: 'Rita Dahal',
    passenger_rating: 4.7,
    mutual_friends: 2,
    seats_requested: 2,
    pickup_location: 'Maitighar Mandala',
    status: 'pending',
    passenger_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHSmrenyS0KSuPW82NFXzXOa0NrYZv-KXcXY-l1H6K23YT_BygNolz8l6z7Gil38FG3Qv3zwnwmHeTQkVnrKRjZdLByeEMt8JhTAjFqh8nDoIsI9v47zSMTkNazZav0Wr8wwpAe76_SnjBJTjvEWWNYkOvdjDKEyxUTMT3QLN-bv6u-E2G90EZn5VDSS9XPF3woU3cg8-SbDb6w5ezaqN07T2mTWlfAbubYEVvLOwjAEjkSdbkpbGCDBhUAAQrLh1vic1XevHKlIw',
    credit_offer: 40
  }
];

export const mockApi = {
  requestOtp: async (phone: string) => {
    console.log('Mock: Requesting OTP for', phone);
    return { success: true };
  },
  verifyOtp: async (phone: string, otp: string) => {
    console.log('Mock: Verifying OTP', otp, 'for', phone);
    return {
      access_token: 'mock-token',
      token_type: 'bearer',
      user_id: 'user-1',
      onboarding_completed: true,
    };
  },
  getUser: async () => MOCK_USER,
  getRides: async () => MOCK_RIDES,
  getRequests: async () => MOCK_RIDE_REQUESTS,
  submitKyc: async () => ({ status: 'pending' }),
  getKycStatus: async () => ({ status: 'verified' }),
  submitFeedback: async () => ({ success: true }),
  getStatus: async () => ({ is_active: true }),
};
