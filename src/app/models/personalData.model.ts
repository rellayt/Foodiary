export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface PersonalData {
  _id?: string,
  forename?: string,
  surname?: string,
  gender?: Gender,
  dateOfBirth?: Date,
  city?: string,
  province?: number,
  residingAbroad?: string
}
