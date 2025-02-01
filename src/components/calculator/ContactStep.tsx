import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { CalculatorInputs } from "./types";

interface ContactStepProps {
  register: UseFormRegister<CalculatorInputs>;
}

export function ContactStep({ register }: ContactStepProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Input 
          id="name" 
          type="text" 
          {...register("name", { required: "Full name is required" })} 
          placeholder=" "
          className="h-14 w-full px-4 pt-4 peer border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
        />
        <Label 
          htmlFor="name" 
          className="absolute text-gray-500 text-sm duration-150 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
        >
          Full Name *
        </Label>
      </div>
      
      <div className="relative">
        <Input 
          id="phone" 
          type="tel" 
          {...register("phone", { required: "Phone number is required" })} 
          placeholder=" "
          className="h-14 w-full px-4 pt-4 peer border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
        />
        <Label 
          htmlFor="phone" 
          className="absolute text-gray-500 text-sm duration-150 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
        >
          Phone Number *
        </Label>
      </div>
      
      <div className="relative">
        <Input 
          id="email" 
          type="email" 
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })} 
          placeholder=" "
          className="h-14 w-full px-4 pt-4 peer border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
        />
        <Label 
          htmlFor="email" 
          className="absolute text-gray-500 text-sm duration-150 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
        >
          Email *
        </Label>
      </div>
      
      <p className="text-sm text-gray-500">* Required fields</p>
    </div>
  );
}