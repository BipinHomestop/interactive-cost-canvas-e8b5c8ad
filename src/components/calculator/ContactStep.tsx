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
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" type="text" {...register("name", { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" {...register("phone", { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email", { required: true })} />
      </div>
    </div>
  );
}