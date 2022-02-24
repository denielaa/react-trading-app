import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { Fields } from '~/shared/constants/tradingTable'
import { useFormControls } from './ExecuteFormControl'

const inputFieldValues = [
  {
    name: Fields.EXCHANGE,
    label: 'Exchange',
    id: 'my-exchange',
    disabled: true
  },
  {
    name: Fields.INSTRUMENT,
    label: 'Instrument',
    id: 'my-instrument',
    disabled: true
  },
  {
    name: Fields.QUANTITY,
    label: 'Quantity',
    id: 'my-quantity',
    disabled: false
  }
]

export const ExecuteModal = ({ plan, isOpen, onClose, onConfirm }) => {
  const { handleInputValue, formIsValid, errors, handleFormSubmit } =
    useFormControls(plan, onConfirm)

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Execution confirmation</DialogTitle>
      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <DialogContent>
          <Box
            component="div"
            sx={{ display: 'flex', flexDirection: 'row', p: 2 }}
          >
            {inputFieldValues.map((field, index) => {
              return (
                <TextField
                  key={index}
                  name={field.name}
                  onChange={handleInputValue}
                  label={field.label}
                  variant="outlined"
                  disabled={field.disabled}
                  size="small"
                  sx={{ mx: 0.5 }}
                  defaultValue={plan[field.name]}
                  {...(errors[field.name] && {
                    error: true,
                    helperText: errors[field.name]
                  })}
                />
              )
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formIsValid()}
          >
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
