import { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ExchangeType, InstrumentTypes } from 'shared/constants/exchanges'
import { Fields } from 'shared/constants/tradingTable'
import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'
import useInterval from 'shared/hooks/interval'
import {
  decimalRandomizer,
  booleanRandomizer,
  generateNewTrading
} from 'shared/utils/randomizer'

import './styles.css'
import ButtonImport from 'shared/components/ButtonImport'

const columns = [
  { field: Fields.EXECUTE, sortable: false, filter: false },
  {
    field: Fields.EXCHANGE,
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
    field: Fields.INSTRUMENT,
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
    field: Fields.QUANTITY,
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
  { field: Fields.BID },
  { field: Fields.ASK }
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

  const onCellValueChanged = useCallback(event => {
    if (event.colDef.field === Fields.EXCHANGE) {
      const newStore = [...rowData]
      newStore[event.rowIndex].exchange = event.newValue
      newStore[event.rowIndex].instrument = InstrumentTypes[event.newValue][0]
      setRowData(newStore)
    }
  }, [])

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
      <div className="m-2 flex flex-row">
        <div className="flex-grow text-2xl">Trading Plan</div>
        <div className="flex-shrink-0 items-center">
          <ButtonImport onChange={handleOnChange} />
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
          onCellValueChanged={onCellValueChanged}
        ></AgGridReact>
      </div>
    </div>
  )
}
