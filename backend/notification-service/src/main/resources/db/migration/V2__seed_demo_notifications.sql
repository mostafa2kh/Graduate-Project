INSERT INTO notifications (user_id, type, title, body, data, is_read, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'booking_confirmed', 'Booking Confirmed', 'Your booking for Modern Downtown Apartment has been confirmed.', '{"listingId":"197c92f1-f270-493a-98de-0873c95c3bc9"}', false, NOW() - INTERVAL '2 hours'),
  ('a0000000-0000-0000-0000-000000000003', 'payment_received', 'Payment Received', 'Your payment of $450 for Modern Downtown Apartment has been processed.', '{"listingId":"197c92f1-f270-493a-98de-0873c95c3bc9","amount":450}', false, NOW() - INTERVAL '1 hour'),
  ('a0000000-0000-0000-0000-000000000002', 'new_booking', 'New Booking Request', 'You have received a new booking request for Modern Downtown Apartment from Jane Renter.', '{"listingId":"197c92f1-f270-493a-98de-0873c95c3bc9","renterId":"a0000000-0000-0000-0000-000000000003"}', false, NOW() - INTERVAL '2 hours'),
  ('a0000000-0000-0000-0000-000000000002', 'booking_updated', 'Booking Updated', 'Your booking has been accepted by the renter.', '{}', true, NOW() - INTERVAL '90 minutes'),
  ('a0000000-0000-0000-0000-000000000001', 'kyc_pending', 'KYC Submission Pending Review', 'A new KYC verification submission is pending your review from user Jane Renter.', '{}', false, NOW() - INTERVAL '30 minutes'),
  ('a0000000-0000-0000-0000-000000000003', 'welcome', 'Welcome to RentSphere!', 'Welcome! Complete your profile and get verified to start booking listings.', '{}', true, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
