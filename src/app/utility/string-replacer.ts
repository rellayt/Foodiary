export const replaceAt = (word, index, replacement) => word.substr(0, index) + replacement + word.substr(index + replacement.length)
