import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if it's a Word document
      if (selectedFile.name.endsWith('.doc') || selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
        toast.success(`Selected: ${selectedFile.name}`);
      } else {
        toast.error('Please select a Word document (.doc or .docx)');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a Word document to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      setUploadProgress(100);

      toast.success('Word document uploaded successfully. Note: Automatic data extraction is not yet implemented.');

      // Reset form
      setFile(null);
      const input = document.getElementById('file-input') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload the document. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-elegant">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Document Upload
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload Word documents containing student data to make them searchable by roll number
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Upload Student Document
            </CardTitle>
            <CardDescription>
              Select a Word document (.doc or .docx) containing student information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="file-input" className="text-sm font-medium">
                Select Word Document
              </Label>
              <Input
                id="file-input"
                type="file"
                accept=".doc,.docx"
                onChange={handleFileSelect}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            {file && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Alert className="border-accent/20 bg-accent/5">
          <AlertCircle className="h-4 w-4 text-accent-foreground" />
          <AlertDescription className="text-accent-foreground">
            <strong>Note:</strong> Currently, Word documents are uploaded but data extraction needs to be implemented manually. 
            You will need to manually enter student data from the uploaded documents into the database.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default DocumentUpload;