// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Type Imports
type UserProp = {
  user: UserDetailProps | null
  token: string
  isAdminLoggedIn: boolean
  authUserLoading: boolean
}

type UserDetailProps = {
  bio:string
  displayName: string
  email: string
  isadmin: boolean
  isroadmin: boolean
  phoneNumber: string
  photoURL: string
  uid: string
}

const initialState: UserProp = {
  user: null,
  token: '',
  authUserLoading: false,
  isAdminLoggedIn: false
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
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
    }
  }
})

export const { setAuthUser, setAuthLoading, authLogout, updateUser } = authSlice.actions

export default authSlice.reducer
