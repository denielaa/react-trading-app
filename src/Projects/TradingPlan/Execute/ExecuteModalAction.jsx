import { useState, useCallback } from 'react'
import { Fields } from '~/shared/constants/tradingTable'

export const useExecuteModalAction = () => {
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false)
  const [activePlan, setActivePlan] = useState({
    node: null,
    exchange: null,
    instrument: null,
    quantity: null
  })

  const handleClickOpen = useCallback(nodeRow => {
    setActivePlan({
      node: nodeRow,
      exchange: nodeRow.data.exchange,
      instrument: nodeRow.data.instrument,
      quantity: nodeRow.data.quantity
    })
    setIsExecuteModalOpen(true)
  }, [])

  const handleCloseExecuteModal = () => {
    setIsExecuteModalOpen(false)
  }

  const handleConfirmExecuteModal = updatedPlan => {
    const quantity = Number(updatedPlan.quantity)

    if (!Number.isNaN(quantity)) {
      updatedPlan.node.setDataValue(Fields.QUANTITY, quantity)
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
