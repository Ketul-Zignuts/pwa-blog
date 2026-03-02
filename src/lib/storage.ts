'use client'

const createNoopStorage = () => ({
  getItem: (_key: string) => {
    if (typeof window === 'undefined') return Promise.resolve(null)
    return localStorage.getItem(_key)
  },
  setItem: (_key: string, value: string) => {
    if (typeof window === 'undefined') return Promise.resolve()
    return localStorage.setItem(_key, value)
  },
  removeItem: (_key: string) => {
    if (typeof window === 'undefined') return Promise.resolve()
    return localStorage.removeItem(_key)
  },
})

export default typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage()
