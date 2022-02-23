import Button from '@mui/material/Button'

export default props => {
  const buttonClicked = () => {
    props.context.handleClickOpen(props.rowIndex)
  }

  return (
    <Button
      style={{ fontSize: 10 }}
      size="small"
      variant="contained"
      onClick={buttonClicked}
    >
      Execute
    </Button>
  )
}
