import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Calendar, MapPin, Phone, Mail } from 'lucide-react';

interface StudentDetailsProps {
  rollNumber: string;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ rollNumber }) => {
  // Mock student data based on roll number pattern
  const getStudentDetails = (rollNo: string) => {
    const year = rollNo.substring(0, 2);
    const dept = rollNo.substring(2, 5);
    const id = rollNo.substring(5);
    
    return {
      name: `Student ${id}`,
      department: dept === 'CSE' ? 'Computer Science & Engineering' : 
                 dept === 'ECE' ? 'Electronics & Communication' :
                 dept === 'EEE' ? 'Electrical & Electronics' :
                 dept === 'MEC' ? 'Mechanical Engineering' :
                 dept === 'CIV' ? 'Civil Engineering' : 
                 'Unknown Department',
      year: `20${year}`,
      semester: getCurrentSemester(year),
      batch: `Batch 20${year}-${parseInt(year) + 4}`,
      email: `${rollNo.toLowerCase()}@giet.edu`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: 'GIET University, Gunupur, Odisha',
      status: 'Active'
    };
  };

  const getCurrentSemester = (year: string) => {
    const admissionYear = parseInt(`20${year}`);
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - admissionYear;
    const currentMonth = new Date().getMonth();
    
    let semester = (yearDiff * 2) + (currentMonth >= 6 ? 1 : 0);
    return Math.min(Math.max(semester, 1), 8);
  };

  const student = getStudentDetails(rollNumber);

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
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="default" className="bg-success text-success-foreground">
                {student.status}
              </Badge>
            </div>
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
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{student.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admission Year</p>
              <p className="font-semibold">{student.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Semester</p>
              <Badge variant="secondary">
                Semester {student.semester}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Batch</p>
              <p className="font-semibold">{student.batch}</p>
            </div>
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
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-sm">{student.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-sm">{student.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;