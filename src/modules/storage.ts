export const toSave = (key: string) => (value: string) => sessionStorage.setItem(key, value)
export const read = (key: string) => sessionStorage.getItem(key)
