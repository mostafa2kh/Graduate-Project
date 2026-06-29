export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'apartment' | 'house' | 'villa' | 'studio';
  city: string;
  state: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  landlordId: string;
  landlordName: string;
  landlordAvatar: string;
  landlordRating: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  trustScore: number; // Simulated AI safety verification score
  reviews: Review[];
  isFeatured: boolean;
}

export const initialListings: Listing[] = [
  {
    id: 'list-1',
    title: 'Minimalist Obsidian Glass Villa',
    description: 'This architectural masterpiece combines floor-to-ceiling smart glass walls with raw obsidian steel structures. Features breathtaking panoramic mountain views, a heated saltwater infinity pool, smart automated climate zones, a fully loaded designer kitchen, and direct private elevator access.',
    price: 3200,
    type: 'villa',
    city: 'Los Angeles',
    state: 'California',
    lat: 34.0522,
    lng: -118.2437,
    bedrooms: 4,
    bathrooms: 4.5,
    area: 4200,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pool', 'Gym', 'Wifi', 'Air Conditioning', 'Parking', 'Smart Home', 'Furnished'],
    landlordId: 'landlord-1',
    landlordName: 'Sarah Landlord',
    landlordAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    landlordRating: 4.9,
    status: 'APPROVED',
    trustScore: 98,
    isFeatured: true,
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'Ethan Hunt',
        reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-15',
        comment: 'Absolutely stunning. The glass reflection at dusk is unmatched. Extremely professional host.'
      }
    ]
  },
  {
    id: 'list-2',
    title: 'Urban Chic Sky Loft',
    description: 'Located in the heart of downtown, this industrial loft features double-height exposed brick walls, polished concrete flooring, a custom metal floating staircase, and premium designer furnishings. Walking distance to elite galleries, top restaurants, and light rail.',
    price: 1850,
    type: 'apartment',
    city: 'New York',
    state: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    bedrooms: 2,
    bathrooms: 2,
    area: 1650,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Wifi', 'Air Conditioning', 'Gym', 'Pet Friendly', 'Balcony', 'Furnished'],
    landlordId: 'landlord-1',
    landlordName: 'Sarah Landlord',
    landlordAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    landlordRating: 4.9,
    status: 'APPROVED',
    trustScore: 92,
    isFeatured: true,
    reviews: [
      {
        id: 'rev-2',
        reviewerName: 'Mia Wallace',
        reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
        rating: 4.8,
        date: '2026-06-01',
        comment: 'A true designer loft. The high ceilings make it feel massive. Noise isolation from the city is perfect.'
      }
    ]
  },
  {
    id: 'list-3',
    title: 'Mid-Century Modern Sanctuary',
    description: 'Nestled under giant oak trees, this beautiful mid-century property embraces organic materials, skylights, and indoor plants. Complete with custom walnut cabinetry, premium brass details, an open-concept lounge, and a peaceful rock garden patio.',
    price: 2400,
    type: 'house',
    city: 'Austin',
    state: 'Texas',
    lat: 30.2672,
    lng: -97.7431,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 2500,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Wifi', 'Air Conditioning', 'Parking', 'Pet Friendly', 'Balcony', 'Garden'],
    landlordId: 'landlord-2',
    landlordName: 'Frank Landlord',
    landlordAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    landlordRating: 4.5,
    status: 'APPROVED',
    trustScore: 89,
    isFeatured: false,
    reviews: []
  },
  {
    id: 'list-4',
    title: 'Minimalist Concrete Studio',
    description: 'An elegant, hyper-functional studio apartment built with raw architectural concrete and warm oak panels. Equipped with space-saving integrated furniture, a pull-down projection screen, high-fidelity sound bar, and dynamic smart-tint windows.',
    price: 1100,
    type: 'studio',
    city: 'Seattle',
    state: 'Washington',
    lat: 47.6062,
    lng: -122.3321,
    bedrooms: 1,
    bathrooms: 1,
    area: 580,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Wifi', 'Air Conditioning', 'Furnished', 'Smart Home'],
    landlordId: 'landlord-3',
    landlordName: 'Maren Ross',
    landlordAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    landlordRating: 4.7,
    status: 'APPROVED',
    trustScore: 95,
    isFeatured: false,
    reviews: []
  },
  {
    id: 'list-5',
    title: 'Pacific Coast Smart Mansion',
    description: 'Gorgeously elevated above the coastal cliffs, this automated luxury mansion boasts a direct view of the Pacific Ocean. Features an 8-car subterranean garage, indoor private spa/sauna, executive home office, wine cellar, and integrated multi-channel smart systems.',
    price: 4900,
    type: 'villa',
    city: 'Malibu',
    state: 'California',
    lat: 34.0259,
    lng: -118.7798,
    bedrooms: 5,
    bathrooms: 6,
    area: 6800,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pool', 'Gym', 'Wifi', 'Air Conditioning', 'Parking', 'Smart Home', 'Furnished', 'Balcony'],
    landlordId: 'landlord-1',
    landlordName: 'Sarah Landlord',
    landlordAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    landlordRating: 4.9,
    status: 'PENDING',
    trustScore: 78,
    isFeatured: false,
    reviews: []
  }
];

export const getListings = (): Listing[] => {
  const stored = localStorage.getItem('rentsphere_listings');
  if (!stored) {
    localStorage.setItem('rentsphere_listings', JSON.stringify(initialListings));
    return initialListings;
  }
  return JSON.parse(stored);
};

export const saveListings = (listings: Listing[]) => {
  localStorage.setItem('rentsphere_listings', JSON.stringify(listings));
};
