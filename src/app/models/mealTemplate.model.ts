import { Product } from './products.model';
export interface MealTemplate {
  name: string,
  time: string,
  products: Product[];
}
