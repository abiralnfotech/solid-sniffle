export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type RideStatus = 'requested' | 'accepted' | 'active' | 'awaiting_confirmation' | 'completed' | 'cancelled';

export type FlagReason = 'reckless_driving' | 'unpunctual' | 'inappropriate_behavior' | 'asked_for_cash' | 'other';

export interface UserCreate {
  phone_number: string;
  full_name: string;
}

export interface UserRead {
  phone_number: string;
  full_name: string;
  user_id: string;
  role: string;
  is_banned: boolean;
}

export interface KYCCreate {
  document_type: string;
  document_number: string;
  driver_license_number?: string | null;
  identity_front_url: string;
  identity_back_url: string;
  driver_license_url?: string | null;
}

export interface KYCRead {
  document_type: string;
  document_number: string;
  driver_license_number: string | null;
  identity_front_url: string;
  identity_back_url: string;
  driver_license_url: string | null;
  kyc_id: string;
  user_id: string;
  status: VerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export interface RouteCreate {
  start_location: [number, number]; // [longitude, latitude]
  destination_location: [number, number];
  departure_time: string;
  available_seats: number;
}

export interface RouteRead {
  route_id: string;
  driver_id: string;
  start_location: { coordinates: [number, number] } | [number, number];
  destination_location: { coordinates: [number, number] } | [number, number];
  departure_time: string;
  available_seats: number;
  is_active: boolean;
  created_at: string;
}

export interface RideCreate {
  route_id: string;
  seat_count?: number;
}

export interface RideRead {
  route_id: string;
  seat_count: number;
  ride_id: string;
  passenger_id: string;
  status: RideStatus;
  fixed_fare_credits: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditBalance {
  user_id: string;
  balance: number;
}

export interface CreditLedgerRead {
  ledger_id: number;
  ride_id: string | null;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
}

export interface RideReviewCreate {
  is_good: boolean;
  flag_reason?: FlagReason | null;
  comment?: string | null;
  ride_id: string;
}

export interface RideReviewRead {
  review_id: string;
  ride_id: string;
  reviewer_id: string;
  reviewee_id: string;
  is_good: boolean;
  flag_reason: FlagReason | null;
  comment: string | null;
  created_at: string;
}

export interface LocationUpdateCreate {
  location: [number, number];
  ride_id: string;
}

export interface LocationUpdateRead {
  stream_id: number;
  ride_id: string;
  driver_id: string;
  location: { coordinates: [number, number] } | [number, number];
  timestamp: string;
}

export interface SOSAlertCreate {
  location: [number, number];
  ride_id: string;
}

export interface SOSAlertRead {
  sos_id: string;
  ride_id: string;
  user_id: string;
  location: { coordinates: [number, number] } | [number, number];
  is_resolved: boolean;
  created_at: string;
}
