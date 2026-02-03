export type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export type ConfirmContextType = {
  confirm: (options?: ConfirmOptions) => Promise<boolean>
}
