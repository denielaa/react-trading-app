import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'

import './styles.css'

const columns = [
  { field: 'execute' },
  { field: 'exchange', editable: true },
  { field: 'instrument', editable: true },
  { field: 'quantity' },
  { field: 'bid' },
  { field: 'ask' }
]

export const TradingPlan = () => {
  // set to default data
  const [rowData, setRowData] = useState([
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
      quantity: '500',
      bid: '2.93674',
      ask: '2.93769'
    }
  ])

  return (
    <div>
      <div className="text-2xl m-2">
        Trading Plan
        {/* Button */}
      </div>
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          pagination={true}
          defaultColDef={{ sortable: true, filter: true }}
          rowData={rowData}
          columnDefs={columns}
          immutableData={true}
        ></AgGridReact>
      </div>
    </div>
  )
}
