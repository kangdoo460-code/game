export interface AnimalLevel {
  id: number;
  thaiName: string;
  englishName: string;
  emoji: string; // Fallback or UI accent
}

export enum GameState {
  LOADING_IMAGE = 'LOADING_IMAGE',
  PLAYING = 'PLAYING',
  CORRECT = 'CORRECT',
  COMPLETED = 'COMPLETED',
  ERROR_GENERATING = 'ERROR_GENERATING'
}

export interface GenerationConfig {
  apiKey?: string;
}