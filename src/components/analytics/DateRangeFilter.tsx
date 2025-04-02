
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  customStartDate: Date | undefined;
  setCustomStartDate: (date: Date | undefined) => void;
  customEndDate: Date | undefined;
  setCustomEndDate: (date: Date | undefined) => void;
  applyCustomRange: () => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  timeRange,
  setTimeRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  applyCustomRange
}) => {
  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="timeRange" className="mb-1.5 block">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="timeRange">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {timeRange === 'custom' && (
            <>
              <div>
                <Label htmlFor="startDate" className="mb-1.5 block">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStartDate ? format(customStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="endDate" className="mb-1.5 block">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEndDate ? format(customEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      initialFocus
                      disabled={(date) => 
                        customStartDate ? date < customStartDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>
        
        {timeRange === 'custom' && (
          <div className="flex justify-end mt-4">
            <Button 
              onClick={applyCustomRange}
              disabled={!customStartDate || !customEndDate}
              size="sm"
            >
              Apply Custom Range
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
