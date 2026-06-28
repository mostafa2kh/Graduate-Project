-- Seed demo users for the graduation presentation
-- Fixed UUIDs so other services can reference them
-- Passwords are BCrypt-encoded for "password123"
DO $$
DECLARE
    admin_role_id UUID;
    landlord_role_id UUID;
    renter_role_id UUID;
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    SELECT id INTO landlord_role_id FROM roles WHERE name = 'ROLE_LANDLORD';
    SELECT id INTO renter_role_id FROM roles WHERE name = 'ROLE_RENTER';

    INSERT INTO users (id, email, password, full_name, phone, enabled, created_at, updated_at)
    VALUES ('a0000000-0000-0000-0000-000000000001', 'admin@rentsphere.com', '$2a$10$AdFSr1lk7G0ZYrkCmktqzuJqJokq0qcoI5P/8oj6wp7AYrYkB.2la',
            'Admin User', '+1-555-0100', TRUE, NOW(), NOW());

    INSERT INTO users (id, email, password, full_name, phone, enabled, created_at, updated_at)
    VALUES ('a0000000-0000-0000-0000-000000000002', 'landlord@rentsphere.com', '$2a$10$AdFSr1lk7G0ZYrkCmktqzuJqJokq0qcoI5P/8oj6wp7AYrYkB.2la',
            'John Landlord', '+1-555-0101', TRUE, NOW(), NOW());

    INSERT INTO users (id, email, password, full_name, phone, enabled, created_at, updated_at)
    VALUES ('a0000000-0000-0000-0000-000000000003', 'renter@rentsphere.com', '$2a$10$AdFSr1lk7G0ZYrkCmktqzuJqJokq0qcoI5P/8oj6wp7AYrYkB.2la',
            'Jane Renter', '+1-555-0102', TRUE, NOW(), NOW());

    INSERT INTO user_roles (user_id, role_id) VALUES ('a0000000-0000-0000-0000-000000000001', admin_role_id);
    INSERT INTO user_roles (user_id, role_id) VALUES ('a0000000-0000-0000-0000-000000000002', landlord_role_id);
    INSERT INTO user_roles (user_id, role_id) VALUES ('a0000000-0000-0000-0000-000000000003', renter_role_id);
END $$;
