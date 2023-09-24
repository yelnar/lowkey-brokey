import { useDispatch } from 'react-redux'
import { AppDispatch } from './create-store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
