import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { demoAccounts } from '../context/demoAccounts';
import { useAuth } from '../context/useAuth';
import { Home, Search, MessageSquare, Bell, LogOut, User, Settings, Compass, ChevronDown, Heart, CreditCard, ShieldCheck, Users } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: 'RENTER' | 'LANDLORD' | 'ADMIN') => {
    let email = demoAccounts.renter.email;
    if (role === 'LANDLORD') email = demoAccounts.landlord.email;
    if (role === 'ADMIN') email = demoAccounts.admin.email;
    
    login(email, role);
    setDropdownOpen(false);
    
    // Redirect based on selected role dashboard
    if (role === 'ADMIN') {
      navigate('/admin/overview');
    } else if (role === 'LANDLORD') {
      navigate('/dashboard/listings');
    } else {
      navigate('/dashboard/bookings');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <Home className="nav-logo-icon" size={24} />
        <span>RentSphere</span>
      </div>

      <div className="nav-links">
        <Link to="/" className={isActive('/')}>
          <Compass size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Discover
        </Link>
        <Link to="/search" className={isActive('/search')}>
          <Search size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Find Homes
        </Link>

        {user && (
          <>
            {user.role === 'RENTER' && (
              <>
                <Link to="/dashboard/bookings" className={isActive('/dashboard/bookings')}>
                  My Bookings
                </Link>
                <Link to="/dashboard/payments" className={isActive('/dashboard/payments')}>
                  Payments
                </Link>
              </>
            )}
            {user.role === 'LANDLORD' && (
              <>
                <Link to="/dashboard/listings" className={isActive('/dashboard/listings')}>
                  Landlord Panel
                </Link>
                <Link to="/dashboard/requests" className={isActive('/dashboard/requests')}>
                  Requests
                </Link>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin/overview" className={isActive('/admin/overview')}>
                  Admin Console
                </Link>
                <Link to="/admin/users" className={isActive('/admin/users')}>
                  Users
                </Link>
              </>
            )}
            <Link to="/dashboard/messages" className={isActive('/dashboard/messages')}>
              <MessageSquare size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Chat
            </Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <div className="notification-bell" onClick={() => navigate('/dashboard/notifications')}>
              <Bell size={20} className="nav-link" />
              <span className="notification-badge"></span>
            </div>

            <div className="user-profile-menu" ref={dropdownRef}>
              <div className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
                <span className="role-badge">{user.role}</span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>

                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/favorites" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Heart size={16} /> Saved Listings
                  </Link>
                  <Link to="/verification" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <ShieldCheck size={16} /> Verification
                  </Link>
                  {user.role === 'RENTER' && (
                    <Link to="/dashboard/payments" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <CreditCard size={16} /> Payments
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link to="/admin/users" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Users size={16} /> Manage Users
                    </Link>
                  )}
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Settings size={16} /> Settings
                  </Link>

                  <div className="role-switcher-title">Switch Preview Role</div>
                  <div className="role-switch-buttons">
                    <button 
                      className={`role-switch-btn ${user.role === 'RENTER' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('RENTER')}
                    >
                      Renter
                    </button>
                    <button 
                      className={`role-switch-btn ${user.role === 'LANDLORD' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('LANDLORD')}
                    >
                      Landlord
                    </button>
                    <button 
                      className={`role-switch-btn ${user.role === 'ADMIN' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('ADMIN')}
                    >
                      Admin
                    </button>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }}></div>

                  <div className="dropdown-item danger" onClick={() => { logout(); navigate('/login'); setDropdownOpen(false); }}>
                    <LogOut size={16} /> Sign Out
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};
