
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface InstallationDatePickerProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function InstallationDatePicker({ date, onDateSelect }: InstallationDatePickerProps) {
  const isMobile = useIsMobile();
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateSelect(selectedDate);
    setIsCalendarOpen(false); // Close the calendar popover after selection
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-semibold text-lg">Choose Installation Date</h3>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 sm:h-14",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0 pointer-events-auto", isMobile && "w-[calc(100vw-32px)]")}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => date < new Date()}
            className="[&_.rdp-day:hover:not([disabled])]:bg-[#1A3174]/90 [&_.rdp-day:hover:not([disabled])]:text-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
