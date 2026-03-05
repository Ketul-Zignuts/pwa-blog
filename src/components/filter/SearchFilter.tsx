import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { useDebounce } from 'react-use'
import { TextField } from '@mui/material'
import { setFilterBy } from '@/store/slices/filterSlice'

const SearchFilter = () => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector((state) => state.filter.filter)
  const resetKey = useAppSelector((state) => state.filter.resetKey)
  const searchValue = filter?.search
  const [localSearchValue, setLocalSearchValue] = useState(searchValue || '')

  useEffect(() => {
    setLocalSearchValue('')
  }, [resetKey])

  useDebounce(
    () => {
      dispatch(
        setFilterBy({
          ...filter,
          search: localSearchValue
        })
      )
    },
    500,
    [localSearchValue]
  )

  return (
    <TextField
      fullWidth
      size='small'
      placeholder='Search...'
      value={localSearchValue}
      onChange={(e) => setLocalSearchValue(e.target.value)}
    />
  )
}

export default SearchFilter