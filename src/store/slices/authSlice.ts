// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Type Imports
type UserProp = {
  user: any
}

const initialState: UserProp = {
  user : null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUserData: (state, action: PayloadAction<any>) => {
      state.user = action.payload
    }
  }
})

export const { saveUserData } = authSlice.actions

export default authSlice.reducer
