-- Create storage policies for student-documents bucket

-- Allow public uploads to student-documents bucket
CREATE POLICY "Allow public uploads to student-documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-documents');

-- Allow public access to view student-documents
CREATE POLICY "Allow public access to student-documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-documents');

-- Allow public updates to student-documents (for overwrites)
CREATE POLICY "Allow public updates to student-documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'student-documents');

-- Allow public deletes from student-documents
CREATE POLICY "Allow public deletes from student-documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'student-documents');