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
  4: {
    snowfall: string;
    granite: string;
    slate: string;
  };
  5: {
    no: string;
    yes: string;
    standard: string;
    large: string;
  };
  6: string;
  7: string;
  8: string;
}