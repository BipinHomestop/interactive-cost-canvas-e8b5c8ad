
import { CalculatorInputs } from "../../types";
import * as db from "./databaseQueries";

export const getStemWallImageType = (options: Partial<CalculatorInputs>) => {
  if (options.needStemWalls === 'no') return 'stem-wall-no';
  if (options.needStemWalls === 'yes' && !options.stemWallType) return 'stem-wall-yes';
  return `stem-wall-${options.stemWallType}`;
};

export const handleStemWallImage = async (collection: any, options: Partial<CalculatorInputs>) => {
  let imagePath = '';
  
  if (options.needStemWalls === 'no') {
    imagePath = collection.stem_wall_no_image;
  } else if (options.needStemWalls === 'yes' && !options.stemWallType) {
    imagePath = collection.stemwall_yes_image;
  } else if (options.stemWallType === 'standard') {
    imagePath = collection.stem_wall_standard_image;
  } else if (options.stemWallType === 'large') {
    imagePath = collection.stem_wall_large_image;
  }

  console.log('Handling stem wall image with collection:', collection.id, 'and options:', options);
  console.log('Selected image path:', imagePath);

  await db.updateStepImagesLastSelected(5);
  
  const imageType = getStemWallImageType(options);
  await db.insertStepImage(5, imageType, imagePath, true);
  
  return { image_path: imagePath };
};

export const handleStepsImage = async (collection: any, needSteps: string) => {
  const imagePath = needSteps === 'yes' 
    ? collection.steps_yes_image 
    : collection.steps_no_image;
  
  // Store the selected image in the database for consistency
  await db.updateStepImagesLastSelected(6);
  
  const imageType = needSteps === 'yes' ? 'steps-yes' : 'steps-no';
  await db.insertStepImage(6, imageType, imagePath, true);
  
  return { image_path: imagePath };
};

export const handleExtraFootageImage = async (options: Partial<CalculatorInputs>) => {
  let imageType = 'default';
  
  if (options.needExtraFootage === 'no') {
    imageType = 'no';
  } else if (options.needExtraFootage === 'yes') {
    if (options.extraFootage) {
      imageType = options.extraFootage;
    } else {
      imageType = 'yes';
    }
  }
  
  // Get the existing image if available
  const existingImage = await db.getStepImage(7, imageType);
  
  if (existingImage) {
    await db.updateStepImagesLastSelected(7);
    await db.insertStepImage(7, imageType, existingImage.image_path, true);
    return { image_path: existingImage.image_path };
  }
  
  return null;
};

export const handleConditionImage = async (condition: string) => {
  if (!condition) return null;
  
  // Get the existing image if available
  const existingImage = await db.getStepImage(8, condition);
  
  if (existingImage) {
    await db.updateStepImagesLastSelected(8);
    await db.insertStepImage(8, condition, existingImage.image_path, true);
    return { image_path: existingImage.image_path };
  }
  
  return null;
};

export const storeGarageFinishImage = async (garageFinish: string) => {
  if (!garageFinish) return null;
  
  const finishCollection = await db.getFinishCollectionImage(garageFinish);
  
  if (finishCollection) {
    const imagePath = finishCollection.garage_finish_image;
    
    await db.updateStepImagesLastSelected(4);
    await db.insertStepImage(4, garageFinish, imagePath, true);
    
    return { collection: finishCollection, image_path: imagePath };
  }
  
  return null;
};
