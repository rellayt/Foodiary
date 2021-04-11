import { MealTemplate } from './mealTemplate.model';
import { Macro } from './macro.model';

export interface Diary {
  _id?: string,
  name: string;
  mealTemplates: MealTemplate[];
}

export interface DiaryMetadata {
  _id?: string,
  name: string,
  templateNames: string[],
  totalMacro: Macro,
  updatedAt?: Date
}
