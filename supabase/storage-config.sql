-- ============================================================
-- atomlearn — Supabase Storage Bucket Configuration
-- Run in the Supabase SQL Editor after schema.sql
-- ============================================================

-- 1. VIDEOS — private, signed URLs, instructors/admins upload
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos', 'videos', FALSE,
  2147483648,   -- 2 GB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "videos: instructors upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
  );

CREATE POLICY "videos: enrolled students read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'videos'
    AND (
      auth.role() = 'service_role'
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
    )
  );


-- 2. THUMBNAILS — public, image files only, instructors upload
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails', 'thumbnails', TRUE,
  5242880,   -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "thumbnails: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "thumbnails: instructors upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
  );


-- 3. RESOURCES — private signed URLs, enrolled students download
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources', 'resources', FALSE,
  52428800,   -- 50 MB
  ARRAY['application/pdf', 'text/plain', 'application/zip', 'text/csv',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/octet-stream']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "resources: enrolled students read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resources'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "resources: instructors upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resources'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
  );


-- 4. CERTIFICATES — private, only the earning student can download
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates', 'certificates', FALSE,
  10485760,   -- 10 MB
  ARRAY['application/pdf', 'text/html', 'image/png']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "certificates: owner reads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'certificates'
    AND (
      -- Path pattern: {student_id}/{course_id}/certificate.*
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

CREATE POLICY "certificates: service insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'certificates'
    AND auth.role() = 'service_role'
  );


-- 5. AVATARS — public, users upload own only
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 'avatars', TRUE,
  2097152,   -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars: own upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    -- Path pattern: {user_id}/avatar.*
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars: own update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
