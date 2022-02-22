import { useState, useEffect, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ExchangeType, InstrumentTypes } from 'shared/constants/exchanges'
import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'

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

const numberRandomizer = () => {
  return Math.floor(Math.random() * 100)
}

const decimalRandomizer = () => {
  const precision = 100 // 2 decimals
  return (
    Math.floor(
      Math.random() * (10 * precision - 1 * precision) + 1 * precision
    ) /
    (1 * precision)
  )
}

const booleanRandomizer = () => {
  // 40% probability of true
  return Math.random() > 0.4
}

const getInitialData = () => {
  // create 5 sample data
  const data = []
  for (let i = 0; i < 5; i++) {
    const exchange = exchangeRandomizer()
    data.push({
      id: uuidv4(),
      execute: false,
      exchange,
      instrument: instrumentRandomizer(exchange),
      quantity: numberRandomizer(),
      bid: decimalRandomizer(),
      ask: decimalRandomizer()
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
        bid: booleanRandomizer() ? decimalRandomizer() : item.bid,
        ask: booleanRandomizer() ? decimalRandomizer() : item.ask
      })
    })
    setRowData(newStore)
  }, [rowData])

  const getRowNodeId = useCallback(data => {
    return data.id
  }, [])

  const addData = useCallback(
    data => {
      const newStore = [...rowData]
      data.forEach(item => {
        newStore.push({
          id: uuidv4(),
          execute: '',
          exchange: item.exchange.toUpperCase(),
          instrument: item.instrument,
          quantity: item.quantity,
          bid: decimalRandomizer(),
          ask: decimalRandomizer()
        })
      })

      setRowData(newStore)
    },
    [rowData]
  )

  const handleOnChange = e => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    Papa.parse(file, {
      header: true,
      escapeChar: '"',
      skipEmptyLines: true,
      complete: result => {
        addData(result.data)
      }
    })
  }

  // useEffect(() => {
  //   const interval = setInterval(updatePrices, 1000)
  //   return () => clearInterval(interval)
  // }, [])

  return (
    <div>
      <div className="m-2 flex">
        <div className="flex-grow text-2xl">Trading Plan</div>
        <div className="flex-1">
          {/* TODO: Create new component for import button */}
          <label htmlFor="csv-file-input" className="import">
            Import CSV
          </label>
          <input
            type={'file'}
            id={'csv-file-input'}
            accept={'.csv'}
            onChange={handleOnChange}
          />
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
