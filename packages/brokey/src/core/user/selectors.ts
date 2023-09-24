import { AppState } from '../create-store'

export const selectUserHasBeenGreeted = (state: AppState) =>
  state.user.hasBeenGreeted
