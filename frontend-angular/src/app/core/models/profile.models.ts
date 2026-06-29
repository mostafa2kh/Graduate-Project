export interface ProfileData {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  city: string;
  area: string;
  dateOfBirth: string;
  preferredLanguage: string;
  renter: boolean;
  landlord: boolean;
  verified: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreferencesData {
  id: string;
  userId: string;
  minPrice: number;
  maxPrice: number;
  preferredBedrooms: number;
  preferredBathrooms: number;
  propertyType: string;
  furnished: string;
  notificationEmail: boolean;
  notificationPush: boolean;
  notificationSms: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationSummary {
  verified: boolean;
  status: string;
  message: string;
}
