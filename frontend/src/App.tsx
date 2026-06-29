import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { ListingDetail } from './pages/ListingDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RenterDashboard } from './pages/RenterDashboard';
import { LandlordDashboard } from './pages/LandlordDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Favorites } from './pages/Favorites';
import { PaymentHistory } from './pages/PaymentHistory';
import { PaymentCheckout } from './pages/PaymentCheckout';
import { AdminUsers } from './pages/AdminUsers';
import { NotFound } from './pages/NotFound';
import './App.css';

// Guard for authenticated routes
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized roles to home or a logical panel
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated general routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/verification" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Renter Specific Panel */}
          <Route path="/dashboard/bookings" element={
            <ProtectedRoute allowedRoles={['RENTER']}>
              <RenterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/bookings/:bookingId" element={
            <ProtectedRoute allowedRoles={['RENTER']}>
              <RenterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/payments" element={
            <ProtectedRoute allowedRoles={['RENTER']}>
              <PaymentHistory />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/payments/:bookingId/checkout" element={
            <ProtectedRoute allowedRoles={['RENTER']}>
              <PaymentCheckout />
            </ProtectedRoute>
          } />

          {/* Landlord Specific Panel */}
          <Route path="/dashboard/listings" element={
            <ProtectedRoute allowedRoles={['LANDLORD']}>
              <LandlordDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/listings/create" element={
            <ProtectedRoute allowedRoles={['LANDLORD']}>
              <LandlordDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/listings/:listingId" element={
            <ProtectedRoute allowedRoles={['LANDLORD']}>
              <ListingDetail />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/requests" element={
            <ProtectedRoute allowedRoles={['LANDLORD']}>
              <LandlordDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Specific Panel */}
          <Route path="/admin/overview" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/listings" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/listings/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/kyc" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/kyc/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Notifications />
            </ProtectedRoute>
          } />

          {/* Messaging Panels */}
          <Route path="/dashboard/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/messages/:threadId" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />

          {/* Notifications Panel */}
          <Route path="/dashboard/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />

          {/* Catch-all Redirect */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
