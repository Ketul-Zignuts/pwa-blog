// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Type Imports
type HomeSliceProp = {
  category_id: string | null | undefined
}

const initialState: HomeSliceProp = {
  category_id:''
}

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setCategoryTab: (state, action: PayloadAction<any>) => {
      state.category_id = action.payload
    }
  }
})

export const { setCategoryTab } = homeSlice.actions

export default homeSlice.reducer
