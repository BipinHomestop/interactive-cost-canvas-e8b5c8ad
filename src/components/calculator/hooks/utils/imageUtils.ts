
import { CalculatorInputs } from "../../types";
import * as db from "./databaseQueries";

export const getStemWallImageType = (options: Partial<CalculatorInputs>) => {
  if (options.needStemWalls === 'no') return 'stem-wall-no';
  if (options.needStemWalls === 'yes' && !options.stemWallType) return 'stem-wall-yes';
  return `stem-wall-${options.stemWallType}`;
};

export const handleStemWallImage = async (collection: any, options: Partial<CalculatorInputs>) => {
  let imagePath = '';
  console.log('Handling stem wall image with options:', options);
  
  if (options.needStemWalls === 'no') {
    imagePath = collection.stem_wall_no_image;
    console.log('Using stem-wall-no image:', imagePath);
  } else if (options.needStemWalls === 'yes' && !options.stemWallType) {
    imagePath = collection.stemwall_yes_image || collection.stem_wall_standard_image;
    console.log('Using stem-wall-yes image:', imagePath);
  } else if (options.stemWallType === 'standard') {
    imagePath = collection.stem_wall_standard_image;
    console.log('Using stem-wall-standard image:', imagePath);
  } else if (options.stemWallType === 'large') {
    imagePath = collection.stem_wall_large_image;
    console.log('Using stem-wall-large image:', imagePath);
  }

  if (!imagePath) {
    console.warn('No stem wall image found in collection, falling back to default finish image');
    imagePath = collection.garage_finish_image;
  }

  await db.updateStepImagesLastSelected(5);
  
  const imageType = getStemWallImageType(options);
  await db.insertStepImage(5, imageType, imagePath, true);
  
  return { image_path: imagePath };
};

export const handleStepsImage = (collection: any, needSteps: string) => {
  const imagePath = needSteps === 'yes' 
    ? collection.steps_yes_image 
    : collection.steps_no_image;
  
  return { image_path: imagePath };
};
