import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Search, User } from 'lucide-react';
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
      toast.error('Please enter a roll number');
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
    }, 800);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-elegant">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Student Image Lookup
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter a student roll number to view their official image from GIET University portal
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
              Enter the student's roll number (e.g., 22CSE1015) to fetch their image
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
              <CardTitle>Student Image</CardTitle>
              <CardDescription>
                {rollNumber && `Showing results for roll number: ${rollNumber.toUpperCase()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="w-80 h-96 rounded-lg" />
                    <Skeleton className="w-40 h-4 mx-auto" />
                  </div>
                ) : imageError ? (
                  <Alert className="max-w-md border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      No image found for roll number "{rollNumber.toUpperCase()}". 
                      Please check the roll number and try again.
                    </AlertDescription>
                  </Alert>
                ) : imageUrl ? (
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={imageUrl}
                        alt={`Student ${rollNumber.toUpperCase()}`}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        className="max-w-80 max-h-96 object-cover rounded-lg shadow-elegant border-4 border-white"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        ✓ Found
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-muted-foreground mb-1">Roll Number</p>
                      <p className="font-semibold text-lg">{rollNumber.toUpperCase()}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-8 text-center">
          <Alert className="max-w-2xl mx-auto border-accent/20 bg-accent/5">
            <AlertCircle className="h-4 w-4 text-accent-foreground" />
            <AlertDescription className="text-accent-foreground">
              <strong>Note:</strong> This application fetches student images from the GIET University portal. 
              Images are only available for enrolled students with valid roll numbers.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default StudentImageLookup;