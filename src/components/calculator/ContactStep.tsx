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
        <Label htmlFor="name">Full Name *</Label>
        <Input 
          id="name" 
          type="text" 
          {...register("name", { required: "Full name is required" })} 
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input 
          id="phone" 
          type="tel" 
          {...register("phone", { required: "Phone number is required" })} 
          placeholder="Enter your phone number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
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
        />
      </div>
      <p className="text-sm text-gray-500">* Required fields</p>
    </div>
  );
}