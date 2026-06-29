export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  renterId: string;
  renterName: string;
  landlordId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
  messages: ChatMessage[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'booking' | 'chat' | 'kyc' | 'moderation';
}

export interface FavoriteListing {
  userId: string;
  listingId: string;
  createdAt: string;
}

const initialBookings: Booking[] = [
  {
    id: 'book-1',
    listingId: 'list-2',
    listingTitle: 'Urban Chic Sky Loft',
    listingImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=300&q=80',
    renterId: 'renter-1',
    renterName: 'John Renter',
    landlordId: 'landlord-1',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    totalPrice: 9250,
    status: 'PAID'
  },
  {
    id: 'book-2',
    listingId: 'list-1',
    listingTitle: 'Minimalist Obsidian Glass Villa',
    listingImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80',
    renterId: 'renter-1',
    renterName: 'John Renter',
    landlordId: 'landlord-1',
    startDate: '2026-08-01',
    endDate: '2026-08-07',
    totalPrice: 19200,
    status: 'PENDING'
  }
];

const initialThreads: ChatThread[] = [
  {
    id: 'thread-1',
    participants: [
      { id: 'renter-1', name: 'John Renter', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', role: 'RENTER' },
      { id: 'landlord-1', name: 'Sarah Landlord', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', role: 'LANDLORD' }
    ],
    messages: [
      { id: 'msg-1', senderId: 'renter-1', senderName: 'John Renter', text: 'Hi Sarah, is the Obsidian Villa available for the first week of August?', timestamp: '2026-06-28T14:32:00Z' },
      { id: 'msg-2', senderId: 'landlord-1', senderName: 'Sarah Landlord', text: 'Hello John! Yes, it is fully prepared and open. Feel free to send a booking request.', timestamp: '2026-06-28T14:45:00Z' },
      { id: 'msg-3', senderId: 'renter-1', senderName: 'John Renter', text: 'Great! I just submitted the booking request. Looking forward to it.', timestamp: '2026-06-28T15:02:00Z' }
    ]
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'renter-1',
    title: 'Booking Approved',
    message: 'Your booking request for Urban Chic Sky Loft has been approved! Proceed to payment.',
    date: '2026-06-28T10:00:00Z',
    read: false,
    type: 'booking'
  },
  {
    id: 'notif-2',
    userId: 'landlord-1',
    title: 'New Booking Request',
    message: 'John Renter requested a booking for Minimalist Obsidian Glass Villa.',
    date: '2026-06-28T15:03:00Z',
    read: false,
    type: 'booking'
  }
];

export const getBookings = (): Booking[] => {
  const stored = localStorage.getItem('rentsphere_bookings');
  if (!stored) {
    localStorage.setItem('rentsphere_bookings', JSON.stringify(initialBookings));
    return initialBookings;
  }
  return JSON.parse(stored);
};

export const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem('rentsphere_bookings', JSON.stringify(bookings));
};

export const getChatThreads = (): ChatThread[] => {
  const stored = localStorage.getItem('rentsphere_chat_threads');
  if (!stored) {
    localStorage.setItem('rentsphere_chat_threads', JSON.stringify(initialThreads));
    return initialThreads;
  }
  return JSON.parse(stored);
};

export const saveChatThreads = (threads: ChatThread[]) => {
  localStorage.setItem('rentsphere_chat_threads', JSON.stringify(threads));
};

export const getNotifications = (): Notification[] => {
  const stored = localStorage.getItem('rentsphere_notifications');
  if (!stored) {
    localStorage.setItem('rentsphere_notifications', JSON.stringify(initialNotifications));
    return initialNotifications;
  }
  return JSON.parse(stored);
};

export const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('rentsphere_notifications', JSON.stringify(notifications));
};

export const getFavoriteListings = (): FavoriteListing[] => {
  const stored = localStorage.getItem('rentsphere_favorites');
  return stored ? JSON.parse(stored) : [];
};

export const saveFavoriteListings = (favorites: FavoriteListing[]) => {
  localStorage.setItem('rentsphere_favorites', JSON.stringify(favorites));
};

export const isListingFavorited = (userId: string, listingId: string) => {
  return getFavoriteListings().some(favorite => favorite.userId === userId && favorite.listingId === listingId);
};

export const toggleFavoriteListing = (userId: string, listingId: string) => {
  const favorites = getFavoriteListings();
  const exists = favorites.some(favorite => favorite.userId === userId && favorite.listingId === listingId);
  const updated = exists
    ? favorites.filter(favorite => !(favorite.userId === userId && favorite.listingId === listingId))
    : [...favorites, { userId, listingId, createdAt: new Date().toISOString() }];
  saveFavoriteListings(updated);
  return !exists;
};

export const removeFavoriteListing = (userId: string, listingId: string) => {
  saveFavoriteListings(getFavoriteListings().filter(favorite => !(favorite.userId === userId && favorite.listingId === listingId)));
};
