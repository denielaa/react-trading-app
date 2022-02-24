import { useState, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'

import { ExchangeType, InstrumentTypes } from '~/shared/constants/exchanges'
import { Fields } from '~/shared/constants/tradingTable'
import useInterval from '~/shared/hooks/interval'
import { CsvParser } from '~/shared/utils/csvParser'
import { numberParser } from '~/shared/utils/agGridParser'
import { numberSetter } from '~/shared/utils/agGridSetter'
import ButtonImport from '~/shared/components/ButtonImport'
import ButtonCellRenderer from './Execute/buttonCellRenderer'
import { useExecuteModalAction } from './Execute/ExecuteModalAction'
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
    valueParser: numberParser,
    valueSetter: numberSetter
  },
  { field: Fields.BID },
  { field: Fields.ASK }
]

export const TradingPlan = () => {
  const gridRef = useRef()
  const [rowData, setRowData] = useState(generateNewTrading())
  const {
    isExecuteModalOpen,
    activePlan,
    handleClickOpen,
    handleCloseExecuteModal,
    handleConfirmExecuteModal
  } = useExecuteModalAction(gridRef)

  const updatePrices = useCallback(() => {
    rowData.forEach(item => {
      if (booleanRandomizer()) {
        gridRef.current.api
          .getRowNode(item.id)
          .setDataValue('bid', decimalRandomizer())
      }
      if (booleanRandomizer()) {
        gridRef.current.api
          .getRowNode(item.id)
          .setDataValue('ask', decimalRandomizer())
      }
    })
  }, [rowData])

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
      event.node.setDataValue(
        Fields.INSTRUMENT,
        InstrumentTypes[event.newValue][0]
      )
    }
  }, [])

  const handleOnChangeImportCsv = e => {
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
          <ButtonImport onChange={handleOnChangeImportCsv} />
        </Box>
      </Box>

      <ExecuteModal
        isOpen={isExecuteModalOpen}
        plan={activePlan}
        onClose={handleCloseExecuteModal}
        onConfirm={handleConfirmExecuteModal}
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
          getRowNodeId={data => {
            return data.id
          }}
          onCellValueChanged={onCellValueChanged}
          context={{
            handleClickOpen
          }}
        ></AgGridReact>
      </Box>
    </div>
  )
}
