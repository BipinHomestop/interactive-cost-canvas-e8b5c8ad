import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { CalculatorInputs } from "./types";
interface ContactStepProps {
  register: UseFormRegister<CalculatorInputs>;
}
export function ContactStep({
  register
}: ContactStepProps) {
  return <div className="space-y-6">
      <div>
        <h2 className="font-bold mb-2 text-[1A3174]">Contact Information</h2>
        <p className="text-gray-600">
          Please provide your contact details so we can send you the estimate.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input id="name" type="text" className="w-full focus:ring-0 focus:outline-none focus:border-[#1A3174]" {...register("name")} placeholder="Enter your full name" />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input id="phone" type="tel" className="w-full focus:ring-0 focus:outline-none focus:border-[#1A3174]" {...register("phone")} placeholder="Enter your phone number" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input id="email" type="email" className="w-full focus:ring-0 focus:outline-none focus:border-[#1A3174]" {...register("email")} placeholder="Enter your email address" />
        </div>
      </div>
    </div>;
}