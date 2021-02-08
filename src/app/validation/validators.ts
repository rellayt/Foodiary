import { ValidatorFn, FormControl } from '@angular/forms';

export const validatePassword = (options: {
  uppercase?: boolean;
  lowercase?: boolean;
  number?: boolean;
  special?: boolean;
}): ValidatorFn => {
  return (control: FormControl) => {

    const rules = {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /[\d]/,
      special: /[\W]/
    }

    const errors = {}
    let valid = true

    Object.entries(rules).forEach(([key, value]) => {
      if (options[key] && !control.value.match(value)) {
        errors[key] = true
        valid = false
      }
    })
    return valid ? null : { 'password': errors }
  }
}

export const validateUsername = (): ValidatorFn => {
  return (control: FormControl) => {
    const pattern = /[a-zA-Z]+[\d]*/

    const input = control.value
    const match = input.match(pattern)

    return match && input == match[0] ? null : { invalid_username: true }
  }
}

export const validateEmail = (): ValidatorFn => {
  return (control: FormControl) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const value = control.value
    const match = value.match(pattern)

    return match && value == match[0] ? null : { invalid_email: true }
  }
}
