export const toSave = (key) => (value) => sessionStorage.setItem(key, value)
export const read = (key) => sessionStorage.getItem(key)
