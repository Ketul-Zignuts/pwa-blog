'use client'

import { useContext } from 'react'
import { ConfirmContext } from '@/context/ConfirmContext'

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext)

  if (!ctx) {
    throw new Error(
      'useConfirm must be used inside ConfirmProvider'
    )
  }

  return ctx
}