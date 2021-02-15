export const getCalory = (protein, carb, fat) => protein * 4 + carb * 4 + fat * 9

export const getNutrientPercent = (nutrientCalory, calory) => +(100 * nutrientCalory / calory).toFixed(1)
