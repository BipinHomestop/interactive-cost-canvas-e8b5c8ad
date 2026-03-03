// Static fallback image map - used when Supabase REST API is unreachable
// These are public Storage CDN URLs that don't require API authentication

const BASE = "https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public";

// Step default images
export const STEP_DEFAULTS: Record<number, string> = {
  1: `${BASE}/calculator-images//1_step.webp`,
  2: `${BASE}/calculator-images//2.webp`,
  3: `${BASE}/calculator-images//3.webp`,
  4: `${BASE}/calculator-images/lovable-uploads/8c5fc18c-04f5-4038-8b7c-26b5ab584d2f.png`,
  9: `${BASE}/calculator-images/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png`,
};

// Step 7 extra footage images
export const EXTRA_FOOTAGE_IMAGES: Record<string, string> = {
  "no": `${BASE}/calculator-images//extra-footage-no.jpg`,
  "yes": `${BASE}/calculator-images//extra-footage-yes.jpg`,
  "up-to-50": `${BASE}/calculator-images//extra-footage-50.jpg`,
  "51-100": `${BASE}/calculator-images//extra-footage-100.jpg`,
  "101-150": `${BASE}/calculator-images//extra-footage-150.jpg`,
  "151-200": `${BASE}/calculator-images//extra-footage-200.jpg`,
};

// Step 8 condition images
export const CONDITION_IMAGES: Record<string, string> = {
  "original": `${BASE}/calculator-images/original-condition.jpg`,
  "existing": `${BASE}/calculator-images/existing-condition.jpg`,
};

// Finish collection fallbacks (garage_finish_image, stemwall variants, steps variants)
export interface FinishFallback {
  garage_finish_image: string;
  stem_wall_standard_image: string;
  stem_wall_large_image: string;
  stem_wall_no_image: string;
  stemwall_yes_image: string;
  steps_yes_image: string;
  steps_no_image: string;
}

const finish = (name: string, folder: string): FinishFallback => ({
  garage_finish_image: `${BASE}/garage-images/${folder}/${name}-main.jpg`,
  stem_wall_standard_image: `${BASE}/garage-images/${folder}/${name}-4-stemwall.jpg`,
  stem_wall_large_image: `${BASE}/garage-images/${folder}/${name}-long-stemwall.jpg`,
  stem_wall_no_image: `${BASE}/garage-images/${folder}/${name}-main.jpg`,
  stemwall_yes_image: `${BASE}/garage-images/${folder}/${name}-4-stemwall.jpg`,
  steps_yes_image: `${BASE}/garage-images/${folder}/${name}-yes-steps.jpg`,
  steps_no_image: `${BASE}/garage-images/${folder}/${name}-no-steps.jpg`,
});

export const FINISH_COLLECTIONS: Record<string, FinishFallback> = {
  "cabin-fever": {
    ...finish("Cabin-fever", "Cabin-fever"),
    garage_finish_image: `${BASE}/garage-images/Cabin-fever/Cabin_fever_main.jpg`,
    stem_wall_no_image: `${BASE}/garage-images/Cabin-fever/Cabin_fever_main.jpg`,
  },
  "carbon": finish("Carbon", "Carbon"),
  "creekbed": finish("Creekbed", "Creekbed"),
  "domino": finish("Domino", "Domino"),
  "nightfall": finish("Nightfall", "Nightfall"),
  "orbit": {
    ...finish("Orbit", "Orbit"),
    stem_wall_large_image: `${BASE}/garage-images/Orbit/orbit-long-stemwall.jpg`,
  },
  "outback": finish("Outback", "Outback"),
  "pecan": finish("Pecan", "Pecan"),
  "shoreline": finish("Shoreline", "Shoreline"),
  "snowfall": {
    ...finish("Snowfall", "Snowfall"),
    steps_yes_image: `${BASE}/garage-images/Snowfall/snowfall-yes-steps.jpg`,
  },
  "tidal-wave": {
    ...finish("Tidalwave", "Tidalwave"),
    stem_wall_large_image: `${BASE}/garage-images/Tidalwave/tidalwave-long-stemwall.jpg`,
    steps_yes_image: `${BASE}/garage-images//placeholder.svg`,
    steps_no_image: `${BASE}/garage-images//placeholder.svg`,
  },
  "wombat": {
    ...finish("Wombat", "Wombat"),
    steps_no_image: `${BASE}/garage-images/Wombat/Wombat-no-steps.webp`,
  },
};

// Option thumbnails for step 4
export const FINISH_OPTION_THUMBNAILS: Record<string, string> = {
  "option-cabin-fever": `${BASE}/garage-images//cabin-fever-sample.jpg`,
  "option-carbon": `${BASE}/garage-images//carbon-sample.jpg`,
  "option-classic": `${BASE}/calculator-images//Classic.jpeg`,
  "option-creekbed": `${BASE}/garage-images//creekbed-sample.jpg`,
  "option-deluxe": `${BASE}/calculator-images//Deluxe.jpeg`,
  "option-domino": `${BASE}/garage-images//domino-sample.jpg`,
  "option-glass": `${BASE}/calculator-images//Glass.jpeg`,
  "option-granite": `${BASE}/calculator-images//Granite.jpeg`,
  "option-minimal": `${BASE}/calculator-images//Minimal.jpeg`,
  "option-modern": `${BASE}/calculator-images//Modern.jpeg`,
  "option-nightfall": `${BASE}/garage-images//nightfall-sample.jpg`,
  "option-orbit": `${BASE}/garage-images//orbit-sample.jpg`,
  "option-outback": `${BASE}/garage-images//outback-sample.jpg`,
  "option-pecan": `${BASE}/garage-images//pecan-sample.jpg`,
  "option-premium": `${BASE}/calculator-images//Premium.jpeg`,
  "option-shoreline": `${BASE}/garage-images//shoreline-sample.jpg`,
  "option-slate": `${BASE}/calculator-images//Slate.jpeg`,
  "option-snowfall": `${BASE}/garage-images//snowfall-sample.jpg`,
  "option-tidal-wave": `${BASE}/garage-images/tidal-wave-sample.jpg`,
  "option-wombat": `${BASE}/garage-images//wombat-sample.jpg`,
};

/**
 * Get a fallback image for a given step + options context.
 * Returns undefined if no fallback is known.
 */
export function getFallbackImage(
  step: number,
  options?: {
    currentCondition?: string;
    needExtraFootage?: string;
    extraFootage?: string;
    garageFinish?: string;
    needStemWalls?: string;
    stemWallType?: string;
    needSteps?: string;
  }
): string | undefined {
  if (step === 8 && options?.currentCondition) {
    return CONDITION_IMAGES[options.currentCondition];
  }

  if (step === 7) {
    if (options?.needExtraFootage === 'no') return EXTRA_FOOTAGE_IMAGES['no'];
    if (options?.needExtraFootage === 'yes') {
      return EXTRA_FOOTAGE_IMAGES[options?.extraFootage || 'yes'];
    }
    return EXTRA_FOOTAGE_IMAGES['no'];
  }

  if (options?.garageFinish) {
    const fc = FINISH_COLLECTIONS[options.garageFinish];
    if (fc) {
      if (step === 4) return fc.garage_finish_image;
      if (step === 5) {
        if (options.needStemWalls === 'no') return fc.stem_wall_no_image;
        if (options.stemWallType === 'large') return fc.stem_wall_large_image;
        if (options.stemWallType === 'standard') return fc.stem_wall_standard_image;
        return fc.stemwall_yes_image;
      }
      if (step === 6) {
        return options.needSteps === 'yes' ? fc.steps_yes_image : fc.steps_no_image;
      }
      if (step === 9) {
        if (options.needStemWalls === 'no') return fc.stem_wall_no_image;
        if (options.stemWallType === 'large') return fc.stem_wall_large_image;
        return fc.stem_wall_standard_image;
      }
    }
  }

  return STEP_DEFAULTS[step];
}
