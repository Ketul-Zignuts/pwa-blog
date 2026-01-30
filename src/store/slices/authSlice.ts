// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Type Imports
type UserProp = {
  user: any
  token:string
  isAdminLoggedIn:boolean
  authUserLoading:boolean
}

const initialState: UserProp = {
  user : null,
  token: '',
  authUserLoading:false,
  isAdminLoggedIn:false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAdminLoggedIn = action.payload.isAdminLoggedIn
    },
    setAuthLoading: (state, action: PayloadAction<any>) => {
      state.authUserLoading = action.payload;
    },
    authLogout: (state) => {
      state.user = null
      state.token = ''
      state.isAdminLoggedIn = false
      state.authUserLoading = false
    },
  }
})

export const { setAuthUser,setAuthLoading,authLogout } = authSlice.actions

export default authSlice.reducer
