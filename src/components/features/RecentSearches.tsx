import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Search } from 'lucide-react';

interface SearchHistory {
  rollNumber: string;
  timestamp: Date;
  found: boolean;
}

interface RecentSearchesProps {
  onSelectRollNumber: (rollNumber: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ onSelectRollNumber }) => {
  const [searches, setSearches] = useState<SearchHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('studentSearchHistory');
    if (saved) {
      const parsed = JSON.parse(saved).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setSearches(parsed.slice(0, 5)); // Show only last 5 searches
    }
  }, []);

  const addSearch = (rollNumber: string, found: boolean) => {
    const newSearch: SearchHistory = {
      rollNumber: rollNumber.toUpperCase(),
      timestamp: new Date(),
      found
    };

    const updatedSearches = [newSearch, ...searches.filter(s => s.rollNumber !== newSearch.rollNumber)]
      .slice(0, 5);
    
    setSearches(updatedSearches);
    localStorage.setItem('studentSearchHistory', JSON.stringify(updatedSearches));
  };

  const clearHistory = () => {
    setSearches([]);
    localStorage.removeItem('studentSearchHistory');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Expose the addSearch function globally
  React.useEffect(() => {
    (window as any).addToSearchHistory = addSearch;
  }, [searches]);

  if (searches.length === 0) {
    return (
      <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No recent searches</p>
            <p className="text-sm">Your search history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Recent Searches
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {searches.map((search, index) => (
            <div
              key={`${search.rollNumber}-${index}`}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <p className="font-medium font-mono">{search.rollNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(search.timestamp)}</p>
                </div>
                <Badge 
                  variant={search.found ? "default" : "destructive"}
                  className={search.found ? "bg-success text-success-foreground" : ""}
                >
                  {search.found ? "Found" : "Not Found"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectRollNumber(search.rollNumber)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;