import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ExchangeType, InstrumentTypes } from 'shared/constants/exchanges'

import './styles.css'

const columns = [
  { field: 'execute' },
  {
    field: 'exchange',
    editable: true,
    singleClickEdit: true,
    cellEditorSelector: params => {
      return {
        component: 'agSelectCellEditor',
        params: {
          values: [ExchangeType.BINANCE, ExchangeType.FTX]
        }
      }
    }
  },
  {
    field: 'instrument',
    editable: true,
    singleClickEdit: true,
    cellEditorSelector: params => {
      console.log(params)
      return {
        component: 'agSelectCellEditor',
        params: {
          values: InstrumentTypes[params.data.exchange]
        }
      }
    }
  },
  { field: 'quantity' },
  { field: 'bid' },
  { field: 'ask' }
]

export const TradingPlan = () => {
  // set to default data
  const [rowData, setRowData] = useState([
    {
      execute: '',
      exchange: 'FTX',
      instrument: 'BTC-USDT',
      quantity: '249.9045',
      bid: '2.93674',
      ask: '2.93769'
    },
    {
      execute: '',
      exchange: 'BINANCE',
      instrument: 'BTC-USD',
      quantity: '249.9045',
      bid: '2.93674',
      ask: '2.93769'
    },
    {
      execute: '',
      exchange: 'FTX',
      instrument: 'BTC-USDT',
      quantity: '500',
      bid: '2.93674',
      ask: '2.93769'
    }
  ])

  return (
    <div>
      <div className="m-2 flex">
        <div className="flex-grow text-2xl">Trading Plan</div>
        <div className="flex-1">
          <button
            className="
              bg-blue-500 
              hover:bg-blue-700 
              text-sm 
              text-white 
              py-2 px-4
              rounded
            "
          >
            Import CSV
          </button>
        </div>
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
