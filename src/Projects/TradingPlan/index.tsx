import { useState, useEffect, useCallback } from 'react'
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

const exchangeRandomizer = () => {
  const exchanges = [ExchangeType.BINANCE, ExchangeType.FTX]
  return exchanges[Math.floor(Math.random() * exchanges.length)]
}

const instrumentRandomizer = exchange => {
  const instruments = InstrumentTypes[exchange]
  return instruments[Math.floor(Math.random() * instruments.length)]
}

const getInitialData = () => {
  // create 5 sample data
  const data = []
  for (let i = 0; i < 5; i++) {
    const exchange = exchangeRandomizer()
    data.push({
      id: i,
      execute: false,
      exchange,
      instrument: instrumentRandomizer(exchange),
      quantity: Math.floor(Math.random() * 100),
      bid: Math.floor(Math.random() * 100),
      ask: Math.floor(Math.random() * 100)
    })
  }
  return data
}

export const TradingPlan = () => {
  const [rowData, setRowData] = useState(getInitialData())

  const updatePrices = useCallback(() => {
    const newStore = []
    rowData.forEach(function (item) {
      newStore.push({
        id: item.id,
        execute: '',
        exchange: item.exchange,
        instrument: item.instrument,
        quantity: item.quantity,
        bid: Math.floor(Math.random() * 100),
        ask: Math.floor(Math.random() * 100)
      })
    })
    setRowData(newStore)
  }, [rowData])

  const getRowNodeId = useCallback(data => {
    return data.id
  }, [])

  useEffect(() => {
    const interval = setInterval(updatePrices, 2000)
    return () => clearInterval(interval)
  }, [])

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
          defaultColDef={{ sortable: true, filter: true }}
          rowData={rowData}
          columnDefs={columns}
          immutableData={true}
          animateRows={true}
          getRowNodeId={getRowNodeId}
        ></AgGridReact>
      </div>
    </div>
  )
}
