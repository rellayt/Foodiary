export const physicalActivity = [
  { value: 1.112, viewValue: 'Prawie brak' },
  { value: 1.272, viewValue: 'Lekka aktywność' },
  { value: 1.425, viewValue: 'Umiarkowana aktywność' },
  { value: 1.60, viewValue: 'Duża aktywność' },
  { value: 1.785, viewValue: 'Bardzo duża aktywność' },
]

export const calculateBasicMetabolism = ({ weight, height, age, gender }) => {
  const genderValues = {
    male: [66.5, 13.75, 5.003, 6.775],
    female: [665.1, 9.563, 1.85, 4.676]
  }
  const values = genderValues[gender]
  return Math.round(values[0] + (values[1] * weight) + (values[2] * height) - (values[3] * age))
}
