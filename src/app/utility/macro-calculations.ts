export const getCalory = ({ protein, carb, fat }) => {
  return protein * 4 + carb * 4 + fat * 9
}

export const getNutrientPercent = (nutrientCalory, calory) => +(100 * nutrientCalory / calory).toFixed(1)

export const getMacroPercentages = (object) => {
  const { protein, carb, fat } = object
  const macroCalory = [protein * 4, carb * 4, fat * 9]
  const totalCalories = macroCalory.reduce((acc, val) => acc + val, 0)
  const percentages = []
  macroCalory.forEach(value => percentages.push((+(100 * value / totalCalories).toFixed(1))))

  return percentages
}

export const normalizeNutriments = (({ protein, carb, fat, quantity }) => {
  const result = [protein, carb, fat].map(nutriment => (nutriment * 100 / quantity))
  return { protein: result[0], carb: result[1], fat: result[2], quantity }
})
