export const numberParser = params => {
  const parsedNumber = Number(params.newValue)
  if (Number.isNaN(parsedNumber) || parsedNumber < 0) {
    return params.oldValue
  }

  return parsedNumber
}
