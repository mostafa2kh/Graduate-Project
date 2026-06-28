-- RentSphere Database Initialization
-- Creates all service databases at container startup

SELECT 'CREATE DATABASE rentsphere_user_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_user_db')\gexec

SELECT 'CREATE DATABASE rentsphere_listing_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_listing_db')\gexec

SELECT 'CREATE DATABASE rentsphere_media_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_media_db')\gexec

SELECT 'CREATE DATABASE rentsphere_ai_review_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_ai_review_db')\gexec

SELECT 'CREATE DATABASE rentsphere_moderation_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_moderation_db')\gexec

SELECT 'CREATE DATABASE rentsphere_verification_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_verification_db')\gexec

SELECT 'CREATE DATABASE rentsphere_search_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_search_db')\gexec

SELECT 'CREATE DATABASE rentsphere_booking_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_booking_db')\gexec

SELECT 'CREATE DATABASE rentsphere_payment_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_payment_db')\gexec

SELECT 'CREATE DATABASE rentsphere_chat_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_chat_db')\gexec

SELECT 'CREATE DATABASE rentsphere_notification_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_notification_db')\gexec

SELECT 'CREATE DATABASE rentsphere_audit_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rentsphere_audit_db')\gexec
