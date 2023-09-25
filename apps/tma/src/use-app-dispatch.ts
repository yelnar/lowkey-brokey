import { useDispatch } from 'react-redux'
import { AppDispatch } from '@lowkey-brokey/sdk'

export const useAppDispatch = () => useDispatch<AppDispatch>()
