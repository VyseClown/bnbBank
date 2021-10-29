/* eslint-disable no-prototype-builtins */
export const isObjectEmpty = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}
