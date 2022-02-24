import { useState } from 'react'

const initialFormValue = {
  quantity: 0,
  formSubmitted: false,
  success: false
}

export const useFormControls = (formValues, onConfirm) => {
  const mergedInitialValues = { ...initialFormValue, ...formValues }
  const [values, setValues] = useState(mergedInitialValues)
  const [errors, setErrors] = useState({})

  const validate = value => {
    const tempErrors = {}
    const parsedQuantity = Number(value.quantity)
    if (!value.quantity) {
      tempErrors.quantity = 'This field is required'
    } else if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      tempErrors.quantity = 'Invalid quantity'
    }

    setErrors({ ...tempErrors })
  }

  const handleInputValue = e => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })

    validate({ [name]: value })
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    onConfirm({
      ...formValues,
      quantity: values.quantity
    })
  }

  const formIsValid = (fieldValues = values) => {
    return fieldValues.quantity && Object.values(errors).every(x => x === '')
  }

  return {
    values,
    errors,
    handleInputValue,
    formIsValid,
    handleFormSubmit
  }
}
