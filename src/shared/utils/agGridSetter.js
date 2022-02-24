export const numberSetter = params => {
  const newValInt = Number(params.newValue)
  const field = params.colDef.field
  const valueChanged = params.data[field] !== newValInt
  if (valueChanged) {
    params.data[field] = newValInt
  }
  return valueChanged
}
