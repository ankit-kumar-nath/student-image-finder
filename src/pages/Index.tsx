import StudentImageLookup from '@/components/StudentImageLookup';
import DocumentUpload from '@/components/DocumentUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Tabs defaultValue="search" className="w-full">
        <div className="flex justify-center pt-6">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="search">Search Student</TabsTrigger>
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="search">
          <StudentImageLookup />
        </TabsContent>
        <TabsContent value="upload">
          <DocumentUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
