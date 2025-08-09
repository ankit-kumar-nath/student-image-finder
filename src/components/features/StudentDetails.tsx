import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { User, GraduationCap, Calendar, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudentDetailsProps {
  rollNumber: string;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ rollNumber }) => {
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!rollNumber) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await (supabase as any)
          .from('student_data')
          .select('*')
          .ilike('roll_number', rollNumber.trim())
          .maybeSingle();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Student not found in database');
          } else {
            setError('Failed to fetch student data');
          }
          console.error('Error fetching student:', fetchError);
          return;
        }

        setStudent(data);
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [rollNumber]);

  const getCurrentSemester = (year: string) => {
    const admissionYear = parseInt(year);
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - admissionYear;
    const currentMonth = new Date().getMonth();
    
    let semester = (yearDiff * 2) + (currentMonth >= 6 ? 1 : 0);
    return Math.min(Math.max(semester, 1), 8);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="w-5 h-5 text-primary" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !student) {
    return (
      <Alert variant="destructive" className="animate-slide-up">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Student data not available'}
        </AlertDescription>
      </Alert>
    );
  }

  // Extract additional info if available
  const additionalInfo = student.additional_info || {};
  const semester = student.year ? getCurrentSemester(student.year) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
      {/* Personal Information */}
      <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-semibold font-mono">{rollNumber.toUpperCase()}</p>
            </div>
            {additionalInfo.status && (
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="default" className="bg-success text-success-foreground">
                  {additionalInfo.status}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="w-5 h-5 text-primary" />
            Academic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {student.department && (
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-semibold">{student.department}</p>
              </div>
            )}
            {student.year && (
              <div>
                <p className="text-sm text-muted-foreground">Admission Year</p>
                <p className="font-semibold">{student.year}</p>
              </div>
            )}
            {student.course && (
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="font-semibold">{student.course}</p>
              </div>
            )}
            {semester && (
              <div>
                <p className="text-sm text-muted-foreground">Current Semester</p>
                <Badge variant="secondary">
                  Semester {semester}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(additionalInfo.email || additionalInfo.Email) && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{additionalInfo.email || additionalInfo.Email}</p>
                </div>
              </div>
            )}
            {(additionalInfo.phone || additionalInfo.Phone) && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{additionalInfo.phone || additionalInfo.Phone}</p>
                </div>
              </div>
            )}
            {(additionalInfo.address || additionalInfo.Address) && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-sm">{additionalInfo.address || additionalInfo.Address}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Display any other additional information */}
          {Object.keys(additionalInfo).filter(key => 
            !['email', 'Email', 'phone', 'Phone', 'address', 'Address', 'status', 'Status'].includes(key)
          ).length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(additionalInfo)
                  .filter(([key]) => !['email', 'Email', 'phone', 'Phone', 'address', 'Address', 'status', 'Status'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                      <div>
                        <p className="text-xs text-muted-foreground">{key}</p>
                        <p className="text-sm font-medium">{String(value)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;