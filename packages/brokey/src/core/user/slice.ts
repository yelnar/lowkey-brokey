import { createSlice } from '@reduxjs/toolkit'

type UserSlice = {
  hasBeenGreeted: boolean
}

const initialUserState: UserSlice = {
  hasBeenGreeted: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    greeted: (state) => {
      state.hasBeenGreeted = true
    },
  },
})

export const { greeted } = userSlice.actions
export default userSlice.reducer
