import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { supabase } from '@/integrations/supabase/client';
import mammoth from 'mammoth';

interface StudentData {
  rollNumber: string;
  name?: string;
  department?: string;
  course?: string;
  year?: string;
}

const DocumentUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedData, setUploadedData] = useState<StudentData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const extractStudentData = (text: string): StudentData[] => {
    const students: StudentData[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // Common patterns for roll numbers
    const rollNumberPatterns = [
      /\b\d{2}[A-Z]{3}\d{4}\b/g, // Pattern like 22CSE1015
      /\b\d{4}[A-Z]{2,4}\d{3,4}\b/g, // Alternative patterns
      /\bRoll\s*No\s*:?\s*(\d{2}[A-Z]{3}\d{4})/gi,
      /\bRoll\s*Number\s*:?\s*(\d{2}[A-Z]{3}\d{4})/gi
    ];

    lines.forEach((line, index) => {
      rollNumberPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const rollNumber = match.replace(/Roll\s*No\s*:?\s*/gi, '').replace(/Roll\s*Number\s*:?\s*/gi, '').trim();
            
            // Try to extract additional info from the same line or nearby lines
            const name = extractName(line, lines, index);
            const department = extractDepartment(line, lines, index);
            const course = extractCourse(line, lines, index);
            const year = extractYear(rollNumber);

            students.push({
              rollNumber: rollNumber.toUpperCase(),
              name,
              department,
              course,
              year
            });
          });
        }
      });
    });

    // Remove duplicates based on roll number
    const uniqueStudents = students.filter((student, index, self) => 
      index === self.findIndex(s => s.rollNumber === student.rollNumber)
    );

    return uniqueStudents;
  };

  const extractName = (currentLine: string, allLines: string[], currentIndex: number): string | undefined => {
    // Look for name patterns in current and nearby lines
    const namePatterns = [
      /Name\s*:?\s*([A-Za-z\s]+)/i,
      /Student\s*Name\s*:?\s*([A-Za-z\s]+)/i
    ];

    for (let i = Math.max(0, currentIndex - 2); i <= Math.min(allLines.length - 1, currentIndex + 2); i++) {
      for (const pattern of namePatterns) {
        const match = allLines[i].match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }
    return undefined;
  };

  const extractDepartment = (currentLine: string, allLines: string[], currentIndex: number): string | undefined => {
    const deptPatterns = [
      /Department\s*:?\s*([A-Za-z\s]+)/i,
      /Dept\s*:?\s*([A-Za-z\s]+)/i,
      /(Computer Science|CSE|Mechanical|ECE|EEE|Civil|IT)/i
    ];

    for (let i = Math.max(0, currentIndex - 2); i <= Math.min(allLines.length - 1, currentIndex + 2); i++) {
      for (const pattern of deptPatterns) {
        const match = allLines[i].match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }
    return undefined;
  };

  const extractCourse = (currentLine: string, allLines: string[], currentIndex: number): string | undefined => {
    const coursePatterns = [
      /Course\s*:?\s*([A-Za-z\s]+)/i,
      /(B\.Tech|B\.E|M\.Tech|MBA|MCA)/i
    ];

    for (let i = Math.max(0, currentIndex - 2); i <= Math.min(allLines.length - 1, currentIndex + 2); i++) {
      for (const pattern of coursePatterns) {
        const match = allLines[i].match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }
    return undefined;
  };

  const extractYear = (rollNumber: string): string | undefined => {
    // Extract year from roll number (first 2 digits)
    const yearMatch = rollNumber.match(/^(\d{2})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      return `20${year}`;
    }
    return undefined;
  };

  const saveToLocalStorage = (students: StudentData[]) => {
    // Store data in localStorage for now since database types aren't configured
    const existingData = localStorage.getItem('student_data');
    const currentData = existingData ? JSON.parse(existingData) : [];
    
    // Merge new data with existing, avoiding duplicates
    const mergedData = [...currentData];
    students.forEach(newStudent => {
      const existingIndex = mergedData.findIndex(s => s.rollNumber === newStudent.rollNumber);
      if (existingIndex >= 0) {
        mergedData[existingIndex] = newStudent; // Update existing
      } else {
        mergedData.push(newStudent); // Add new
      }
    });
    
    localStorage.setItem('student_data', JSON.stringify(mergedData));
  };

  const processWordFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      
      const extractedData = extractStudentData(text);
      
      if (extractedData.length === 0) {
        throw new Error('No student data found in the document. Please ensure the document contains roll numbers in the format like 22CSE1015.');
      }

      saveToLocalStorage(extractedData);
      setUploadedData(extractedData);
      
      toast.success(`Successfully processed ${extractedData.length} student records`);
      
    } catch (error) {
      console.error('Error processing Word file:', error);
      throw error;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      toast.error('Please upload a Word document (.doc or .docx)');
      return;
    }

    setIsProcessing(true);
    
    try {
      await processWordFile(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Student Data
          </CardTitle>
          <CardDescription>
            Upload a Word document (.doc or .docx) containing student information with roll numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <FileText className="w-8 h-8 text-primary" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-medium">
                  {isProcessing ? 'Processing document...' : 'Drop your Word file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports .doc and .docx files. The document should contain student roll numbers.
                </p>
              </div>
              
              {!isProcessing && (
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {uploadedData.length > 0 && (
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Extracted Student Data
            </CardTitle>
            <CardDescription>
              Successfully extracted {uploadedData.length} student records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {uploadedData.map((student, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{student.rollNumber}</h4>
                      <div className="bg-success/10 text-success text-xs px-2 py-1 rounded-full">
                        Processed
                      </div>
                    </div>
                    {student.name && (
                      <p><span className="text-muted-foreground">Name:</span> {student.name}</p>
                    )}
                    {student.department && (
                      <p><span className="text-muted-foreground">Department:</span> {student.department}</p>
                    )}
                    {student.course && (
                      <p><span className="text-muted-foreground">Course:</span> {student.course}</p>
                    )}
                    {student.year && (
                      <p><span className="text-muted-foreground">Year:</span> {student.year}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <Alert className="border-success/20 bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success-foreground">
                  All student data has been saved to the database and can now be searched using the image lookup feature.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Alert className="border-accent/20 bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent-foreground" />
        <AlertDescription className="text-accent-foreground">
          <strong>Tip:</strong> For best results, ensure your Word document contains roll numbers in formats like "22CSE1015" 
          along with student names, departments, and other details clearly labeled.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentUpload;