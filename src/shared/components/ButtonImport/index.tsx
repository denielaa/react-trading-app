import React, { forwardRef } from 'react'

import './style.css'

const defaultProps = {
  className: undefined,
  children: undefined,
  variant: 'secondary',
  icon: undefined,
  iconSize: 18,
  disabled: false,
  isWorking: false,
  onChange: () => {}
}

const ButtonImport = forwardRef(({ onChange }, ref) => {
  const handleOnChange = e => {
    onChange(e)
  }

  return (
    <div>
      <label htmlFor="csv-file-input" className="import-button">
        Import CSV
      </label>
      <input
        type={'file'}
        id={'csv-file-input'}
        accept={'.csv'}
        title={'Import CSV'}
        onChange={handleOnChange}
      />
    </div>
  )
})

ButtonImport.defaultProps = defaultProps

export default ButtonImport
