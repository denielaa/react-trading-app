import { useState, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'

import { ExchangeType, InstrumentTypes } from '~/shared/constants/exchanges'
import { Fields } from '~/shared/constants/tradingTable'
import useInterval from '~/shared/hooks/interval'
import { CsvParser } from '~/shared/utils/csvParser'
import ButtonImport from '~/shared/components/ButtonImport'
import ButtonCellRenderer from './Execute/buttonCellRenderer'
import {
  decimalRandomizer,
  booleanRandomizer,
  generateNewTrading
} from '~/shared/utils/randomizer'

import './styles.css'
import { ExecuteModal } from './Execute/ExecuteModal'

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
    width: 150,
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
    },
    valueSetter: params => {
      var newValInt = Number(params.newValue)
      var valueChanged = params.data.quantity !== newValInt
      if (valueChanged) {
        params.data.quantity = newValInt
      }
      return valueChanged
    }
  },
  { field: Fields.BID },
  { field: Fields.ASK }
]

export const TradingPlan = () => {
  const gridRef = useRef()
  const [rowData, setRowData] = useState(generateNewTrading())
  const [open, setOpen] = useState(false)
  const [activePlan, setActivePlan] = useState({
    nodeId: null,
    exchange: null,
    instrument: null,
    quantity: null
  })

  const handleClickOpen = value => {
    // get latest data in grid
    const row = gridRef.current.api.getRowNode(value)

    setActivePlan({
      nodeId: value,
      exchange: row.data.exchange,
      instrument: row.data.instrument,
      quantity: row.data.quantity
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = useCallback(updatedPlan => {
    const rowNode = gridRef.current.api.getRowNode(updatedPlan.nodeId)
    const quantity = Number(updatedPlan.quantity)

    if (!Number.isNaN(quantity)) {
      rowNode.setDataValue(Fields.QUANTITY, quantity)
    }
  })

  const updatePrices = useCallback(() => {
    const newStore = []
    rowData.forEach(item => {
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
        <Box sx={{ flexGrow: 1, fontSize: 24, fontWeight: 'bold' }}>
          Trading Plan
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <ButtonImport onChange={handleOnChange} />
        </Box>
      </Box>

      <ExecuteModal
        isOpen={open}
        plan={activePlan}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />

      <Box className="ag-theme-alpine" sx={{ height: '500px' }}>
        <AgGridReact
          ref={gridRef}
          defaultColDef={{
            sortable: true,
            filter: true,
            enableCellChangeFlash: true
          }}
          rowData={rowData}
          columnDefs={columns}
          immutableData={true}
          animateRows={true}
          getRowNodeId={getRowNodeId}
          onCellValueChanged={onCellValueChanged}
          context={{
            handleClickOpen
          }}
        ></AgGridReact>
      </Box>
    </div>
  )
}
