-- Create table to store student data extracted from Word files
CREATE TABLE public.student_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number TEXT NOT NULL,
  name TEXT,
  course TEXT,
  department TEXT,
  year TEXT,
  additional_info JSONB,
  source_file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster roll number searches
CREATE INDEX idx_student_data_roll_number ON public.student_data(roll_number);

-- Enable Row Level Security
ALTER TABLE public.student_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read student data
CREATE POLICY "Anyone can view student data" 
ON public.student_data 
FOR SELECT 
USING (true);

-- Create policy for admins to insert/update data (for now, allow all authenticated users)
CREATE POLICY "Authenticated users can manage student data" 
ON public.student_data 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for Word files
INSERT INTO storage.buckets (id, name, public) VALUES ('student-documents', 'student-documents', false);

-- Create storage policies for Word file uploads
CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-documents' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_data_updated_at
BEFORE UPDATE ON public.student_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();