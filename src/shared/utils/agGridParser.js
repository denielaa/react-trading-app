export const numberParser = params => {
  const parsedNumber = Number(params.newValue)
  if (Number.isNaN(parsedNumber)) {
    return params.oldValue
  }

  return parsedNumber
}
