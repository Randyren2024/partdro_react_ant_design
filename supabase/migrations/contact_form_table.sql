-- First, create the uuid-ossp extension if not already created
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- Then create the contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_page_name ON public.contacts (page_name);
CREATE INDEX IF NOT EXISTS idx_contacts_submitted_at ON public.contacts (submitted_at);

-- Optional: Enable Row Level Security (RLS) for security
-- ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow authenticated users to read contacts" ON public.contacts FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated users to insert contacts" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow admins to update/delete contacts" ON public.contacts FOR ALL USING (auth.role() = 'admin'); -- Assuming an 'admin' role exists
