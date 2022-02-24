import { useState } from 'react'
import { Fields } from '~/shared/constants/tradingTable'

export const useExecuteModalAction = gridRef => {
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false)
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
    setIsExecuteModalOpen(true)
  }

  const handleCloseExecuteModal = () => {
    setIsExecuteModalOpen(false)
  }

  const handleConfirmExecuteModal = updatedPlan => {
    const rowNode = gridRef.current.api.getRowNode(updatedPlan.nodeId)
    const quantity = Number(updatedPlan.quantity)

    if (!Number.isNaN(quantity)) {
      rowNode.setDataValue(Fields.QUANTITY, quantity)
    }

    handleCloseExecuteModal()
  }

  return {
    isExecuteModalOpen,
    activePlan,
    handleClickOpen,
    handleCloseExecuteModal,
    handleConfirmExecuteModal
  }
}
