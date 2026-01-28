// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Type Imports
type UserProp = {
  user: any
  token:string
  isAdminLoggedIn:boolean
}

const initialState: UserProp = {
  user : null,
  token: '',
  isAdminLoggedIn:false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAdminLoggedIn = action.payload.token
    }
  }
})

export const { setAuthUser } = authSlice.actions

export default authSlice.reducer
