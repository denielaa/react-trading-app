import React, { useState } from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const InitialRowData = [
  {
    execute: '',
    exchange: 'Kucoin Spot',
    instrument: 'MANA-USDT',
    quantity: '249.9045',
    bid: '2.93674',
    ask: '2.93769'
  },
  {
    execute: '',
    exchange: 'Kucoin Spot',
    instrument: 'MANA-USDT',
    quantity: '249.9045',
    bid: '2.93674',
    ask: '2.93769'
  },
  {
    execute: '',
    exchange: 'Kucoin Spot',
    instrument: 'MANA-USDT',
    quantity: '249.9045',
    bid: '2.93674',
    ask: '2.93769'
  }
]

const columns = [
  { field: 'execute' },
  { field: 'exchange', editable: true },
  { field: 'instrument', editable: true },
  { field: 'quantity' },
  { field: 'bid' },
  { field: 'ask' }
]

export const TableGrid = () => {
  // set to default data
  const [rowData, setRowData] = useState(InitialRowData)

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        pagination={true}
        defaultColDef={{ sortable: true, filter: true }}
        rowData={rowData}
        columnDefs={columns}
        immutableData={true}
      ></AgGridReact>
    </div>
  )
}
