
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from 'lucide-react';

interface PageVisitFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  onReset: () => void;
}

export const PageVisitFilter: React.FC<PageVisitFilterProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onReset
}) => {
  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="search" className="mb-1.5 block">Search Pages</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by page name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="sortBy" className="mb-1.5 block">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Page Name</SelectItem>
                <SelectItem value="visits">Visit Count</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="avgTimeOnPage">Time on Page</SelectItem>
                <SelectItem value="firstVisit">First Visit</SelectItem>
                <SelectItem value="lastVisit">Last Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="order" className="mb-1.5 block">Order</Label>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
              <SelectTrigger id="order">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
