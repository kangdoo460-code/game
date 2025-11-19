import { AnimalLevel } from './types';

export const ANIMAL_LEVELS: AnimalLevel[] = [
  { id: 1, thaiName: 'มด', englishName: 'ant', emoji: '🐜' },
  { id: 2, thaiName: 'นก', englishName: 'bird', emoji: '🐦' },
  { id: 3, thaiName: 'แมว', englishName: 'cat', emoji: '🐱' },
  { id: 4, thaiName: 'สุนัข', englishName: 'dog', emoji: '🐶' },
  { id: 5, thaiName: 'เสือ', englishName: 'tiger', emoji: '🐯' },
];

// Fallback images in case API is not set or fails, using Picsum as requested by general rules, 
// though we prefer GenAI. We will use these if GenAI fails.
// Note: Picsum is random, so these are just placeholders to prevent broken UI.
export const FALLBACK_IMAGE = "https://picsum.photos/400/400";