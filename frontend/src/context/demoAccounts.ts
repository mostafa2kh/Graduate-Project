import type { UserRole } from './authTypes';

export const demoAccounts = {
  renter: { id: 'renter-1', email: 'renter@rentsphere.com', name: 'John Renter', role: 'RENTER' as UserRole, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  landlord: { id: 'landlord-1', email: 'landlord@rentsphere.com', name: 'Sarah Landlord', role: 'LANDLORD' as UserRole, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  admin: { id: 'admin-1', email: 'admin@rentsphere.com', name: 'Alex Admin', role: 'ADMIN' as UserRole, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' }
};
