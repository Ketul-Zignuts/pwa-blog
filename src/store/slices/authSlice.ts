// Third-party Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// User Detail Type
export type UserDetailProps = {
  bio: string
  displayName: string
  email: string
  isadmin: boolean
  isroadmin: boolean
  phoneNumber: string
  photoURL: string
  uid: string
}

// Auth State Type
type UserProp = {
  user: UserDetailProps | null
  token: string
  isAdminLoggedIn: boolean
  authUserLoading: boolean
}

// Payload type for login
type SetAuthUserPayload = {
  user: UserDetailProps
  token: string
  isAdminLoggedIn: boolean
}

// Initial State
const initialState: UserProp = {
  user: null,
  token: '',
  authUserLoading: false,
  isAdminLoggedIn: false
}

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<SetAuthUserPayload>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAdminLoggedIn = action.payload.isAdminLoggedIn
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authUserLoading = action.payload
    },

    authLogout: (state) => {
      state.user = null
      state.token = ''
      state.isAdminLoggedIn = false
      state.authUserLoading = false
    },

    updateUser: (state, action: PayloadAction<UserDetailProps>) => {
      state.user = action.payload
    }
  }
})

// Actions
export const { setAuthUser, setAuthLoading, authLogout, updateUser } = authSlice.actions

// Reducer
export default authSlice.reducer