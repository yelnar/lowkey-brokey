import { AppThunk } from '../create-store'
import { greeted } from './slice'

export const greet = (): AppThunk => (dispatch) => {
  dispatch(greeted())
}
