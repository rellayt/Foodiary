import { Product } from '../models/products.model';
import { normalizeNutriments } from "../utility/macro-calculations"

export const clearProduct = ({ _id, id, calory, category, percentages, name, ...clearProduct }) => {
  const product = normalizeNutriments({ ...clearProduct } as any)
  Object.keys(normalizeNutriments({ ...clearProduct } as any)).map((key) => {
    clearProduct[key] = +product[key].toFixed(1)
  })
  clearProduct['id'] = _id ? _id : null
  clearProduct['name'] = name

  return clearProduct as Product
}
