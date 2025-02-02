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
  [key: number]: string | {
    [key: string]: string;
  };
}

export interface NavigationProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isNextDisabled?: boolean;
}
