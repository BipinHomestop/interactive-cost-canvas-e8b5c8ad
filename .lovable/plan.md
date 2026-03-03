

## Problem Analysis

The `TypeError: Failed to fetch` errors occur when the app tries to query Supabase's REST API (`/rest/v1/calculator_step_images`) to get image paths. The Supabase project is active and responsive (confirmed via direct API call), but the browser fetch is being intercepted/blocked in both the preview and published environments.

The root cause is likely a transient network/CORS issue between the user's browser and Supabase. The app has no resilience -- if the database query to get image URLs fails, everything breaks even though the actual images (public storage URLs) are perfectly accessible.

## Plan

### 1. Add static fallback image map

Create a fallback map in `src/components/calculator/hooks/utils/fallbackImages.ts` containing all known image paths from the database. This way, if the Supabase REST API query fails, the app can still display images using these hardcoded public URLs.

The map will cover:
- Default step images (steps 1-9)
- Condition images (step 8: original, existing)
- Extra footage images (step 7)

### 2. Update `useCalculatorImage` to use fallbacks

Modify `src/components/calculator/hooks/useCalculatorImage.tsx` to catch fetch failures and fall back to the static image map instead of showing "Image not available."

### 3. Update `databaseQueries.ts` to return fallbacks on failure

Wrap the retry logic so that on final failure, it returns a fallback image path instead of throwing.

### 4. Update `CurrentConditionStep` with fallback images

The component at `src/components/calculator/CurrentConditionStep.tsx` independently fetches images from Supabase. Add fallback handling there too.

---

**Technical detail**: The fallback URLs are the same public Supabase Storage URLs already in the database (e.g., `https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/calculator-images//1_step.webp`). These are served from Supabase Storage CDN and don't require REST API authentication, so they load even when the REST API is unreachable.

