export const getCalory = (protein, carb, fat) => protein * 4 + carb * 4 + fat * 9

export const getNutrientPercent = (nutrientCalory, calory) => +(100 * nutrientCalory / calory).toFixed(1)
export const getMacroPercentages = (protein: number, carb: number, fat: number) => {
  const macroCalory = [protein * 4, carb * 4, fat * 9]
  const totalCalories = macroCalory.reduce((acc, val) => acc + val, 0)
  const percentages = []
  macroCalory.forEach(value => percentages.push((+(100 * value / totalCalories).toFixed(1))))
  return percentages
}
