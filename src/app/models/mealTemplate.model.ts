import { Product } from './products.model';

export interface MealTemplate {
  id?: string,
  _id?: string,
  name: string,
  time: string,
  products: Product[],
  summary?: {
    protein: number,
    carb: number,
    fat: number,
    calory: number
  }
}
