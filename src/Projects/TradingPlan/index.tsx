import { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'

import { ExchangeType, InstrumentTypes } from 'shared/constants/exchanges'
import { Fields } from 'shared/constants/tradingTable'
import useInterval from 'shared/hooks/interval'
import { CsvParser } from 'shared/utils/csvParser'
import ButtonImport from 'shared/components/ButtonImport'
import ButtonCellRenderer from './Execute/buttonCellRenderer'
import {
  decimalRandomizer,
  booleanRandomizer,
  generateNewTrading
} from 'shared/utils/randomizer'

import './styles.css'

const columns = [
  {
    field: Fields.EXECUTE,
    sortable: false,
    filter: false,
    cellRenderer: ButtonCellRenderer
  },
  {
    field: Fields.EXCHANGE,
    editable: true,
    singleClickEdit: true,
    cellEditorSelector: () => {
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

  const onCellValueChanged = useCallback(
    event => {
      if (event.colDef.field === Fields.EXCHANGE) {
        const newStore = [...rowData]
        newStore[event.rowIndex].exchange = event.newValue
        newStore[event.rowIndex].instrument = InstrumentTypes[event.newValue][0]
        setRowData(newStore)
      }
    },
    [rowData]
  )

  const handleOnChange = e => {
    const file = e.target.files[0]
    CsvParser(file).then(data => {
      addData(data)
      e.target.value = null // reset input file
    })
  }

  useInterval(updatePrices, 1000)

  return (
    <div>
      <Box
        component="div"
        sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}
      >
        <Box sx={{ flexGrow: 1 }}>Trading Plan</Box>
        <Box sx={{ flexShrink: 0 }}>
          <ButtonImport onChange={handleOnChange} />
        </Box>
      </Box>

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
