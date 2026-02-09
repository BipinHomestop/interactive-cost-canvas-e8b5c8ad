
# Fix: Step 9 Displaying Wrong Image

## Problem Identified

Step 9 (Payment Step) is displaying the wrong image because it relies on a **globally shared database flag** (`is_last_selected` in the `calculator_step_images` table) rather than using the current user's session data.

**Current behavior:**
- When user A selects "Carbon" finish with "standard" stem walls, the database updates `is_last_selected = true` for that row
- When user B selects "Shoreline" finish and reaches step 9, the code queries `getLastSelectedImage(5)` from the database
- If user A's selection is still flagged as "last selected", user B sees Carbon images instead of Shoreline

**Database evidence:**
The `calculator_step_images` table currently shows:
- `stem-wall-standard` with `Carbon/Carbon-4-stemwall.jpg` has `is_last_selected: true`
- But the user selected "Shoreline" finish

## Solution

Instead of querying the shared database state, step 9 should use the user's current session form data (which is already available) to fetch the correct image from the `garage_finish_image_collections` table.

## Implementation Steps

### 1. Update `getStepOptions()` in CostCalculator.tsx

Add a `case 9` that passes the user's selected finish and stem wall options:

```text
case 9:
  return {
    garageFinish: formValues.garageFinish,
    needStemWalls: formValues.needStemWalls,
    stemWallType: formValues.stemWallType
  };
```

### 2. Update `useCalculatorImage.tsx` step 9 logic

Replace the current step 9 logic that queries the database:
```text
// Current (broken)
else if (step === 9) {
  imageData = await db.getLastSelectedImage(5);
}
```

With logic that uses the passed options to fetch from `garage_finish_image_collections`:
```text
// Fixed
else if (step === 9 && options?.garageFinish) {
  const finishCollection = await db.getFinishCollectionImage(options.garageFinish);
  if (finishCollection) {
    // Determine correct image based on stem wall selection
    if (options.needStemWalls === 'no') {
      imageData = { image_path: finishCollection.stem_wall_no_image };
    } else if (options.stemWallType === 'large') {
      imageData = { image_path: finishCollection.stem_wall_large_image };
    } else {
      imageData = { image_path: finishCollection.stem_wall_standard_image };
    }
  }
}
```

### 3. Update useEffect dependencies

Add the step 9 relevant options to the dependency array if not already present.

## Files to Modify

1. **src/components/CostCalculator.tsx**
   - Add `case 9` in `getStepOptions()` function

2. **src/components/calculator/hooks/useCalculatorImage.tsx**
   - Update step 9 image loading logic to use options instead of database query

## Technical Details

This solution:
- Uses existing session state (form values) that are already passed through the component tree
- Reuses the existing `getFinishCollectionImage()` function
- Eliminates dependency on shared database state that can be corrupted by concurrent users
- Ensures each user sees images matching their own selections
- Works correctly with the existing image preloading and caching system
