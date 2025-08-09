import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Search, User, History, Info, GraduationCap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import ImageViewer from './features/ImageViewer';
import StudentDetails from './features/StudentDetails';
import RecentSearches from './features/RecentSearches';

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
    
    // Add to search history
    if ((window as any).addToSearchHistory) {
      (window as any).addToSearchHistory(rollNumber, false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
    toast.success('Student image loaded successfully');
    
    // Add to search history
    if ((window as any).addToSearchHistory) {
      (window as any).addToSearchHistory(rollNumber, true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-3xl mb-6 shadow-glow animate-float">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            GIET Student Portal
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Comprehensive student information system with image lookup, academic details, and search history
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search & Recent */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Section */}
            <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Search Student
                </CardTitle>
                <CardDescription>
                  Enter the student's roll number to fetch their information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rollNumber" className="text-sm font-medium mb-2 block">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNumber"
                      placeholder="Enter roll number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 text-lg"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Student
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <div className="animate-slide-up">
              <RecentSearches onSelectRollNumber={(roll) => {
                setRollNumber(roll);
                setTimeout(() => handleSearch(), 100);
              }} />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {hasSearched && (
              <Tabs defaultValue="image" className="w-full animate-fade-in">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-card backdrop-blur-sm">
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="space-y-6">
                  <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Student Image</CardTitle>
                      <CardDescription>
                        {rollNumber && `Showing results for roll number: ${rollNumber.toUpperCase()}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        {isLoading ? (
                          <div className="space-y-4 animate-pulse">
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
                          <ImageViewer
                            imageUrl={imageUrl}
                            rollNumber={rollNumber}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                          />
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  {!imageError && imageUrl && (
                    <StudentDetails rollNumber={rollNumber} />
                  )}
                </TabsContent>

                <TabsContent value="info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Alert className="border-accent/20 bg-accent/5">
                      <AlertCircle className="h-4 w-4 text-accent-foreground" />
                      <AlertDescription className="text-accent-foreground">
                        <strong>Image Source:</strong> Images are fetched directly from the GIET University portal. 
                        Only enrolled students with valid roll numbers will have images available.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="border-primary/20 bg-primary/5">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-primary">
                        <strong>Privacy Notice:</strong> All student information displayed is for academic purposes only. 
                        Personal details are generated for demonstration and may not reflect actual records.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {!hasSearched && (
              <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm animate-slide-up">
                <CardContent className="py-16 text-center">
                  <GraduationCap className="w-24 h-24 mx-auto mb-6 text-muted-foreground/30" />
                  <h3 className="text-2xl font-semibold mb-3">Welcome to GIET Student Portal</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter a student roll number in the search box to get started. You can view student images, 
                    academic details, and manage your search history.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentImageLookup;