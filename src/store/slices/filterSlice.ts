import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SortByType =
  | 'newest'
  | 'oldest'
  | 'most_views'
  | 'most_liked'
  | 'most_commented'

type FilterSliceProp = {
  filter: {
    category_id: string
    sort_by: SortByType | ''
    search: string
    rating:number | null
  },
  resetKey: number
}

const defaultValues: FilterSliceProp['filter'] = {
  category_id: '',
  sort_by: '',
  search: '',
  rating:null
}

const initialState: FilterSliceProp = {
  filter: defaultValues,
  resetKey:0
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilterBy: (state, action: PayloadAction<FilterSliceProp['filter']>) => {
      state.filter = action.payload
    },
    resetFilterBy: (state) => {
      state.filter = defaultValues
      state.resetKey += 1
    }
  }
})

export const { setFilterBy, resetFilterBy } = filterSlice.actions

export default filterSlice.reducer