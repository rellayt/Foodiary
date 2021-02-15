export const calculateByQuantity = (caloryForm) => {
  const quantityValue = (name) => caloryForm.get(name).controls['quantity'].value
  const percentControl = (name) => caloryForm.get(name).controls['percent']

  const [protein, carb, fat] = [quantityValue('protein'), quantityValue('carb'), quantityValue('fat')]
  const percentControls = [percentControl('protein'), percentControl('carb'), percentControl('fat')]

  const nutrientCalories = [protein * 4, carb * 4, fat * 9];
  const totalCalories = nutrientCalories.reduce((acc, val) => acc + val, 0)

  percentControls.forEach((control, index) => {
    control.setValue(+(100 * nutrientCalories[index] / totalCalories).toFixed(1))
  })
};

export const calculateByCaloricBalanace = (caloryForm) => {
  const percentValue = (name) => caloryForm.get(name).controls['percent'].value
  const quantityControl = (name) => caloryForm.get(name).controls['quantity']

  const quantityControls = [quantityControl('protein'), quantityControl('carb'), quantityControl('fat')]
  const calory = caloryForm.controls['calory'].value

  const nutrientPercentages = [percentValue('protein'), percentValue('carb'), percentValue('fat')];

  quantityControls.forEach((control, index) => {
    const result = calory * nutrientPercentages[index] / (100 * (index === 2 ? 9 : 4))
    control.setValue(Math.round(result))
  })

};

export const calculateByPercent = (field: string, caloryForm) => {
  const [quantityControl, percent, calory] = [
    caloryForm.get(field).controls['quantity'],
    caloryForm.get(field).controls['percent'].value,
    caloryForm.controls['calory'].value
  ]

  const result = ((percent / 100) * calory) / (field === 'fat' ? 9 : 4)
  quantityControl.setValue(Math.round(result))
};

export const updateCaloryValue = (caloryForm) => {
  const quantityValue = (name) => caloryForm.get(name).controls['quantity'].value
  const [protein, carb, fat] = [quantityValue('protein'), quantityValue('carb'), quantityValue('fat')]

  const totalCalories = [protein * 4, carb * 4, fat * 9].reduce((acc, val) => acc + val, 0)
  caloryForm.controls['calory'].setValue(totalCalories)
};
