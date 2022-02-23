import { forwardRef } from 'react'

import './style.css'

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

export default ButtonImport
