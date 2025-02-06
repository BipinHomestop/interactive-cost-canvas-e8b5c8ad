
export interface CalculatorInputs {
  location: string;
  name: string;
  phone: string;
  email: string;
  garageCapacity: number;
  garageFinish: "snowfall" | "granite" | "slate" | "modern" | "minimal" | "glass" | "classic" | "premium" | "deluxe";
  needStemWalls: "yes" | "no";
  stemWallType?: "standard" | "large";
  needSteps: "yes" | "no";
  needExtraFootage: "yes" | "no";
  extraFootage?: "up-to-50" | "51-100" | "101-150" | "151-200";
  currentCondition: "original" | "existing";
}

export interface StepImages {
  [key: number]: string | {
    [key: string]: string | {
      [key: string]: string;
    };
  };
}

export interface ImageDisplayProps {
  imageSrc: string;
  totalCost: number;
  step: number;
  options?: Partial<CalculatorInputs>;
}

export interface NavigationProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isNextDisabled?: boolean;
}

export interface ImageCollection {
  id: string;
  finish_type: string;
  garage_finish_image: string;
  stem_wall_standard_image: string;
  stem_wall_large_image: string;
  stem_wall_no_image: string;
  steps_yes_image: string;
  steps_no_image: string;
}
