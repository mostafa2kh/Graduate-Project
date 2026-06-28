-- Seed demo KYC submission for renter
DO $$
DECLARE
    submission_id UUID;
BEGIN
    INSERT INTO kyc_submissions (user_id, status, submission_type, notes, submitted_at)
    VALUES ('a0000000-0000-0000-0000-000000000003', 'PENDING', 'INDIVIDUAL',
            'Government-issued ID and proof of address attached.', NOW() - INTERVAL '2 days')
    RETURNING id INTO submission_id;

    INSERT INTO kyc_documents (submission_id, document_type, file_name, file_path, file_size, content_type)
    VALUES (submission_id, 'PASSPORT', 'passport_scan.pdf', '/uploads/kyc/passport_scan.pdf', 245760, 'application/pdf');

    INSERT INTO kyc_documents (submission_id, document_type, file_name, file_path, file_size, content_type)
    VALUES (submission_id, 'PROOF_OF_ADDRESS', 'utility_bill.pdf', '/uploads/kyc/utility_bill.pdf', 102400, 'application/pdf');

    INSERT INTO kyc_documents (submission_id, document_type, file_name, file_path, file_size, content_type)
    VALUES (submission_id, 'SELFIE', 'selfie.jpg', '/uploads/kyc/selfie.jpg', 512000, 'image/jpeg');
END $$;
