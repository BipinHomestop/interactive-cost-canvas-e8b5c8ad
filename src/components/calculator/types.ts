export interface CalculatorInputs {
  location: string;
  name: string;
  phone: string;
  email: string;
  garageCapacity: number;
  garageFinish: string;
  needStemWalls: string;
  stemWallType?: string;
}

export type StepImages = {
  [key: number]: string | { [key: string]: string };
};