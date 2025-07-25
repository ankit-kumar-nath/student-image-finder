import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Search, User, BookOpen, Building, Calendar, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StudentData {
  id: string;
  roll_number: string;
  name: string | null;
  course: string | null;
  department: string | null;
  year: string | null;
  additional_info: any;
  source_file_name: string | null;
}

const StudentImageLookup = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      toast.error('Please enter a roll number');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setStudentData(null);
    
    try {
      const { data, error } = await supabase
        .from('student_data')
        .select('*')
        .eq('roll_number', rollNumber.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('No student data found for this roll number');
        } else {
          throw error;
        }
      } else {
        setStudentData(data);
        toast.success('Student data found successfully');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to fetch student data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-elegant">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Student Data Lookup
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter a student roll number to view their information from uploaded Word documents
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Student
            </CardTitle>
            <CardDescription>
              Enter the student's roll number to fetch their data from uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="rollNumber" className="text-sm font-medium mb-2 block">
                  Roll Number
                </Label>
                <Input
                  id="rollNumber"
                  placeholder="e.g., 22CSE1015"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-lg"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                {rollNumber && `Showing results for roll number: ${rollNumber.toUpperCase()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="w-96 h-64 rounded-lg" />
                    <Skeleton className="w-40 h-4 mx-auto" />
                  </div>
                ) : !studentData ? (
                  <Alert className="max-w-md border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      No student data found for roll number "{rollNumber.toUpperCase()}". 
                      Please upload the Word document containing this student's data or check the roll number.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-success text-success-foreground rounded-full text-sm font-medium shadow-lg mb-4">
                        ✓
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Student Found</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          Roll Number
                        </div>
                        <p className="font-semibold text-lg">{studentData.roll_number}</p>
                      </div>
                      
                      {studentData.name && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            Name
                          </div>
                          <p className="font-semibold">{studentData.name}</p>
                        </div>
                      )}
                      
                      {studentData.course && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            Course
                          </div>
                          <p className="font-semibold">{studentData.course}</p>
                        </div>
                      )}
                      
                      {studentData.department && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="w-4 h-4" />
                            Department
                          </div>
                          <p className="font-semibold">{studentData.department}</p>
                        </div>
                      )}
                      
                      {studentData.year && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Year
                          </div>
                          <p className="font-semibold">{studentData.year}</p>
                        </div>
                      )}
                      
                      {studentData.source_file_name && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Source File
                          </div>
                          <p className="font-semibold text-sm">{studentData.source_file_name}</p>
                        </div>
                      )}
                    </div>
                    
                    {studentData.additional_info && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="w-4 h-4" />
                          Additional Information
                        </div>
                        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(studentData.additional_info, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-8 text-center">
          <Alert className="max-w-2xl mx-auto border-accent/20 bg-accent/5">
            <AlertCircle className="h-4 w-4 text-accent-foreground" />
            <AlertDescription className="text-accent-foreground">
              <strong>Note:</strong> Student data is extracted from uploaded Word documents. 
              Upload Word files using the document upload feature to add new student records.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default StudentImageLookup;