# Supabase Storage Setup for PDFs

## 1. Create Storage Bucket

Run this SQL in Supabase SQL Editor:

```sql
-- Create the pdfs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true);
```

## 2. Set Up RLS Policies

Run this SQL to allow authenticated users to upload and access PDFs:

```sql
-- Allow anyone to read PDFs (since bucket is public)
CREATE POLICY "Allow public PDF reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'pdfs');

-- Allow authenticated users to upload PDFs
CREATE POLICY "Allow authenticated PDF uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdfs' AND
  (storage.extension(name) = 'pdf')
);

-- Allow authenticated users to update their own PDFs
CREATE POLICY "Allow authenticated PDF updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pdfs');

-- Allow authenticated users to delete PDFs
CREATE POLICY "Allow authenticated PDF deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pdfs');
```

## 3. Alternative: Using Supabase Dashboard

1. Go to [Storage](https://supabase.com/dashboard/project/_/storage/buckets) in your Supabase Dashboard
2. Click **"New bucket"**
3. Name it `pdfs`
4. Set it as **Public** bucket
5. Click **"Create bucket"**
6. Go to **Policies** tab
7. Add the RLS policies shown above using the policy editor

## 4. Bucket Structure

PDFs will be organized by subject:
```
pdfs/
├── Programming Fundamentals/
│   ├── 1234567890-abc123.pdf
│   └── 1234567891-def456.pdf
├── Calculus II/
│   └── 1234567892-ghi789.pdf
└── Vector Analysis/
    └── 1234567893-jkl012.pdf
```

## Notes

- Files are automatically organized by subject name
- Each file gets a unique timestamped name to prevent conflicts
- Public bucket allows anyone with the URL to view PDFs
- RLS policies ensure only authenticated users can upload/delete
- File extension must be `.pdf`
