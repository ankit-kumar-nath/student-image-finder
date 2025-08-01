import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search } from 'lucide-react';
import StudentImageLookup from '@/components/StudentImageLookup';
import DocumentUpload from '@/components/DocumentUpload';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Tabs defaultValue="lookup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="lookup" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Image Lookup
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lookup">
            <StudentImageLookup />
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-elegant">
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  Upload Student Data
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Upload Word documents containing student information to build your database
                </p>
              </div>
              
              <DocumentUpload />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
