export interface AddressRequest {
  street?: string;
  city: string;
  area: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface AvailabilityRequest {
  startDate: string;
  endDate: string;
  available?: boolean;
  notes?: string;
}

export interface ListingRequest {
  title: string;
  description: string;
  price: number;
  currency?: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSize?: number;
  areaUnit?: string;
  yearBuilt?: number;
  furnished?: boolean;
  address?: AddressRequest;
  amenityNames?: string[];
  availability?: AvailabilityRequest[];
}

export interface AmenityItem {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface ListingSummary {
  id: string;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSize: number;
  status: string;
  city: string;
  area: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListingDetail {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSize: number;
  areaUnit: string;
  yearBuilt: number;
  status: string;
  furnished: boolean;
  featured: boolean;
  viewsCount: number;
  address: any;
  amenities: AmenityItem[];
  availability: any[];
  statusHistory: any[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryItem {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  reason: string;
  createdAt: string;
}
