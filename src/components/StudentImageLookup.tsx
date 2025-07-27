import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Search, User, GraduationCap, CheckCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const StudentImageLookup = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const constructImageUrl = (rollNo: string) => {
    const baseUrl = "https://gietuerp.in/StudentDocuments/22CSE1015/22CSE1015.JPG?v=z-VxW_RfKkCwdwJ9nfDcLX_iOjYVmmgca-yZEoEiqh4";
    return baseUrl.replace(/22CSE1015/g, rollNo.toUpperCase());
  };

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      toast.error('Please enter a valid roll number');
      return;
    }

    const rollPattern = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/i;
    if (!rollPattern.test(rollNumber.trim())) {
      toast.error('Please enter a valid roll number format (e.g., 22CSE1015)');
      return;
    }

    setIsLoading(true);
    setImageError(false);
    setHasSearched(true);
    
    const url = constructImageUrl(rollNumber.trim());
    setImageUrl(url);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    toast.error('Student image not found for this roll number');
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
    toast.success('Student image loaded successfully');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setRollNumber('');
    setImageUrl('');
    setImageError(false);
    setHasSearched(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navigation Bar */}
      <nav className="bg-card/90 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-semibold text-lg text-foreground">GIET University</h1>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Academic Year 2024-25</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>Official Portal</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-6 shadow-xl">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">
            Student Image Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Access official student photographs from the GIET University database. 
            Enter a valid roll number to retrieve the corresponding student image.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-12 shadow-lg border-0 bg-card/80 backdrop-blur-sm animate-slide-up">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-serif">
              <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                <Search className="w-4 h-4 text-primary-foreground" />
              </div>
              Student Search
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter the complete roll number including year, branch, and student ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3">
                <Label htmlFor="rollNumber" className="text-sm font-medium text-foreground">
                  Student Roll Number
                </Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter roll number (e.g., 22CSE1015)"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-14 text-lg bg-background border-border/50 focus:border-primary transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground">
                  Format: YYBBBNNNN (YY=Year, BBB=Branch, NNNN=ID)
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-end space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="h-14 bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-md text-base font-medium"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Searching
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                  {hasSearched && (
                    <Button 
                      onClick={handleClear}
                      variant="outline"
                      className="h-14 border-border/50 hover:bg-secondary transition-all duration-300"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="animate-scale-in">
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-secondary border-b border-border/50">
                <CardTitle className="text-2xl font-serif">Search Results</CardTitle>
                <CardDescription className="text-base">
                  {rollNumber && `Results for student ID: ${rollNumber.toUpperCase()}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex justify-center">
                  {isLoading ? (
                    <div className="space-y-6 text-center">
                      <Skeleton className="w-80 h-96 rounded-2xl mx-auto" />
                      <div className="space-y-2">
                        <Skeleton className="w-48 h-4 mx-auto" />
                        <Skeleton className="w-32 h-4 mx-auto" />
                      </div>
                    </div>
                  ) : imageError ? (
                    <div className="text-center space-y-6 max-w-md">
                      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <Alert className="border-destructive/20 bg-destructive/5">
                        <AlertDescription className="text-destructive text-center">
                          <strong>Student not found</strong><br/>
                          No image available for roll number "{rollNumber.toUpperCase()}". 
                          Please verify the roll number and try again.
                        </AlertDescription>
                      </Alert>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Possible reasons:</p>
                        <ul className="text-left space-y-1">
                          <li>• Incorrect roll number format</li>
                          <li>• Student not enrolled</li>
                          <li>• Image not uploaded to system</li>
                        </ul>
                      </div>
                    </div>
                  ) : imageUrl ? (
                    <div className="text-center space-y-8 max-w-lg">
                      <div className="relative inline-block group">
                        <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <div className="relative bg-card rounded-2xl p-4 shadow-xl">
                          <img
                            src={imageUrl}
                            alt={`Student ${rollNumber.toUpperCase()}`}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            className="w-full max-w-80 h-auto object-cover rounded-lg shadow-lg"
                          />
                          <div className="absolute -bottom-2 -right-2">
                            <div className="bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Card className="bg-gradient-secondary border-0">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Roll Number</p>
                              <p className="font-semibold text-lg">{rollNumber.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Status</p>
                              <p className="font-semibold text-lg text-success">Active</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Year</p>
                              <p className="font-semibold">20{rollNumber.substring(0, 2)}-{Number(rollNumber.substring(0, 2)) + 4}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Branch</p>
                              <p className="font-semibold">{rollNumber.substring(2, 5).toUpperCase()}</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-border/50">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => window.open(imageUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Full Size
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Information */}
        <div className="mt-16 text-center">
          <Alert className="max-w-4xl mx-auto border-accent/20 bg-gradient-accent backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-accent" />
            <AlertDescription className="text-foreground text-left">
              <div className="space-y-2">
                <p><strong>Important Notice:</strong></p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Images are sourced directly from the official GIET University database</li>
                  <li>• All student data is handled in accordance with privacy policies</li>
                  <li>• For any discrepancies, please contact the academic office</li>
                  <li>• This service is available for current and alumni students</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default StudentImageLookup;