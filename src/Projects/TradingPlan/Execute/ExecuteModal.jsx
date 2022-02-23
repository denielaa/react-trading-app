import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

export const ExecuteModal = ({ plan, isOpen, handleClose, handleConfirm }) => {
  const [quantity, setQuantity] = useState(plan.quantity)
  const onConfirm = () => {
    handleConfirm({
      ...plan,
      quantity
    })
    handleClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Execution confirmation</DialogTitle>
      <DialogContent>
        <Box
          component="div"
          sx={{ display: 'inline-flex', flexDirection: 'row', p: 2 }}
        >
          <TextField
            id="outlined-basic"
            label="Exchange"
            variant="outlined"
            disabled
            size="small"
            defaultValue={plan.exchange}
          />
          <TextField
            id="outlined-basic"
            label="Instrument"
            variant="outlined"
            disabled
            size="small"
            sx={{ mx: 2 }}
            defaultValue={plan.instrument}
          />
          <TextField
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            size="small"
            defaultValue={plan.quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
