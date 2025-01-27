export interface CalculatorInputs {
  location: string;
  name: string;
  phone: string;
  email: string;
  garageCapacity: number;
  garageFinish: "snowfall" | "granite" | "slate";
  needStemWalls: "yes" | "no";
  stemWallType?: "standard" | "large";
  needSteps: "yes" | "no";
  needExtraFootage: "yes" | "no";
  extraFootage?: "up-to-50" | "51-100" | "101-150" | "151-200";
  currentCondition: "original" | "existing";
}

export interface StepImages {
  1: string;
  2: string;
  3: string;
  4: Record<"snowfall" | "granite" | "slate", string>;
  5: Record<"no" | "yes" | "standard" | "large", string>;
  6: string;
  7: string;
  8: string;
}

export interface ImageDisplayProps {
  imageSrc: string;
  totalCost: number;
  step: number;
}

export interface NavigationProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
}