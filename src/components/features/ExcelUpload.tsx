import { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  onUploadComplete: () => void;
}

export const ExcelUpload = ({ onUploadComplete }: ExcelUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadedCount(0);

    try {
      // Read the Excel file
      const fileBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setError('The Excel file appears to be empty');
        setIsUploading(false);
        return;
      }

      toast({
        title: "Processing Excel file",
        description: `Found ${jsonData.length} records to upload`,
      });

      // Process data in batches
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < jsonData.length; i += batchSize) {
        batches.push(jsonData.slice(i, i + batchSize));
      }

      let totalUploaded = 0;

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        // Call edge function to process this batch
        const { error: functionError } = await supabase.functions.invoke('upload-student-data', {
          body: {
            students: batch,
            sourceFileName: file.name
          }
        });

        if (functionError) {
          throw new Error(functionError.message || 'Failed to upload batch');
        }

        totalUploaded += batch.length;
        setUploadedCount(totalUploaded);
        setUploadProgress((totalUploaded / jsonData.length) * 100);
      }

      toast({
        title: "Upload completed successfully!",
        description: `${totalUploaded} student records have been uploaded`,
      });

      onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Student Data
        </CardTitle>
        <CardDescription>
          Upload an Excel file (.xlsx or .xls) containing student information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('excel-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Choose Excel File'}
          </Button>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Uploaded {uploadedCount} records ({Math.round(uploadProgress)}%)
            </p>
          </div>
        )}

        {uploadedCount > 0 && !isUploading && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              Successfully uploaded {uploadedCount} student records
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Expected Excel columns:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Roll Number (required)</li>
            <li>Name</li>
            <li>Course</li>
            <li>Department</li>
            <li>Year</li>
            <li>Any other student information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};