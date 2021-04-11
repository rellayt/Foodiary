import { getCalory } from "./macro-calculations"

export const createTemplateSummary = (mealTemplates) => {
  return mealTemplates.map(mealTemplate => {
    const nutriments = ['protein', 'carb', 'fat']
    mealTemplate.summary = { protein: 0, carb: 0, fat: 0, calory: 0 }

    nutriments.forEach(nutriment => {
      mealTemplate.summary[nutriment] = mealTemplate.products
        .map(product => product[nutriment])
        .reduce((acc, val) => acc + val, 0)
    })
    mealTemplate.products = mealTemplate.products.map(product => ({ ...product, calory: Math.round(getCalory(product)) }))

    mealTemplate.summary['calory'] = Math.round(getCalory(mealTemplate.summary))

    return mealTemplate
  })
}
