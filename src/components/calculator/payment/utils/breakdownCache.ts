
import { BreakdownItem } from "@/components/calculator/types";

const CACHE_KEY = 'cachedBreakdownItems';

export const getBreakdownFromCache = (): BreakdownItem[] | null => {
  try {
    const cachedItems = sessionStorage.getItem(CACHE_KEY);
    if (cachedItems) {
      return JSON.parse(cachedItems);
    }
  } catch (error) {
    console.error('Error retrieving cached breakdown items:', error);
  }
  return null;
};

export const saveBreakdownToCache = (items: BreakdownItem[]): void => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving breakdown items to cache:', error);
  }
};
