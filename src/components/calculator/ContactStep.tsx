import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { CalculatorInputs } from "./types";

interface ContactStepProps {
  register: UseFormRegister<CalculatorInputs>;
}

export function ContactStep({ register }: ContactStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
        <Input 
          id="name" 
          type="text" 
          {...register("name", { required: "Full name is required" })} 
          placeholder="Enter your full name"
          className="h-12 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1A3174] focus:ring-2 focus:ring-[#1A3174]/20 transition-all"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
        <Input 
          id="phone" 
          type="tel" 
          {...register("phone", { required: "Phone number is required" })} 
          placeholder="Enter your phone number"
          className="h-12 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1A3174] focus:ring-2 focus:ring-[#1A3174]/20 transition-all"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
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
          placeholder="Enter your email"
          className="h-12 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1A3174] focus:ring-2 focus:ring-[#1A3174]/20 transition-all"
        />
      </div>
      <p className="text-sm text-gray-500">* Required fields</p>
    </div>
  );
}