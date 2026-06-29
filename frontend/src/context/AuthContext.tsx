import React, { useState } from 'react';
import { AuthContext } from './authContext';
import { demoAccounts } from './demoAccounts';
import type { User, UserRole } from './authTypes';

const getDemoAccount = (email: string) => {
  return Object.values(demoAccounts).find(account => account.email === email);
};

const normalizeSavedUser = (saved: string): User | null => {
  try {
    const parsed = JSON.parse(saved) as User;
    const demo = getDemoAccount(parsed.email);
    if (!demo) return parsed;

    const normalized = {
      ...parsed,
      ...demo,
      kycStatus: parsed.kycStatus || 'APPROVED'
    } as User;
    localStorage.setItem('rentsphere_session', JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.removeItem('rentsphere_session');
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rentsphere_session');
    return saved ? normalizeSavedUser(saved) : null;
  });

  const login = (email: string, role: UserRole): boolean => {
    let selectedUser: Omit<User, 'kycStatus'> | null = null;
    
    // Find matching demo or generate a default mockup
    if (email === demoAccounts.renter.email) {
      selectedUser = demoAccounts.renter;
    } else if (email === demoAccounts.landlord.email) {
      selectedUser = demoAccounts.landlord;
    } else if (email === demoAccounts.admin.email) {
      selectedUser = demoAccounts.admin;
    } else {
      // Allow arbitrary login for flex testing
      selectedUser = {
        id: `custom-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        email,
        name: email.split('@')[0].toUpperCase(),
        role,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
      };
    }

    const newUser: User = {
      ...selectedUser,
      kycStatus: role === 'ADMIN' ? 'APPROVED' : 'APPROVED' // Auto-approved for simpler demo flow
    };

    setUser(newUser);
    localStorage.setItem('rentsphere_session', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentsphere_session');
  };

  const updateKyc = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (user) {
      const updated = { ...user, kycStatus: status };
      setUser(updated);
      localStorage.setItem('rentsphere_session', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateKyc }}>
      {children}
    </AuthContext.Provider>
  );
};
