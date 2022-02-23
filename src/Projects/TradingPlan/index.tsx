import { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ExchangeType, InstrumentTypes } from 'shared/constants/exchanges'
import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'
import useInterval from 'shared/hooks/interval'
import {
  decimalRandomizer,
  booleanRandomizer,
  generateNewTrading
} from 'shared/utils/randomizer'

import './styles.css'

const columns = [
  { field: 'execute', sortable: false, filter: false },
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
  {
    field: 'quantity',
    editable: true,
    valueParser: params => {
      // TODO: to support locale number format
      const parsedNumber = Number(params.newValue)
      if (Number.isNaN(parsedNumber)) {
        return params.oldValue
      }

      return parsedNumber
    }
  },
  { field: 'bid' },
  { field: 'ask' }
]

export const TradingPlan = () => {
  const [rowData, setRowData] = useState(generateNewTrading())

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
        newStore.splice(0, 0, {
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
    const file = e.target.files[0]
    Papa.parse(file, {
      header: true,
      escapeChar: '"',
      skipEmptyLines: true,
      complete: result => {
        addData(result.data)
        e.target.value = null // reset input file
      }
    })
  }

  useInterval(updatePrices, 1000)

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
          {/* 
          <button className="btn btn-primary" onClick={() => updatePrices()}>
            update
          </button> */}
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
