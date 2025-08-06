import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageViewerProps {
  imageUrl: string;
  rollNumber: string;
  onError: () => void;
  onLoad: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, rollNumber, onError, onLoad }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${rollNumber.toUpperCase()}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);
  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="text-center space-y-4 animate-bounce-in">
      <Card className="inline-block shadow-glow border-0 bg-gradient-card backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="relative group">
            <img
              src={imageUrl}
              alt={`Student ${rollNumber.toUpperCase()}`}
              onError={onError}
              onLoad={onLoad}
              className="max-w-80 max-h-96 object-cover rounded-lg shadow-elegant border-4 border-background transition-transform duration-300"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            
            {/* Image Controls Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={zoomIn}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={zoomOut}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={rotate}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={`Student ${rollNumber.toUpperCase()}`}
                        className="w-full h-auto max-h-[90vh] object-contain"
                      />
                      <Button
                        onClick={handleDownload}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Success Badge */}
            <div className="absolute -bottom-2 -right-2 animate-float">
              <Badge className="bg-success text-success-foreground shadow-lg">
                ✓ Found
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Info Card */}
      <Card className="max-w-md mx-auto shadow-card border-0 bg-gradient-card backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-semibold text-lg font-mono">{rollNumber.toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
                className="bg-white/50 backdrop-blur-sm"
              >
                Reset View
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageViewer;