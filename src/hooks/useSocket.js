
import { useContext } from 'react'
import SocketContext from '../contexts/socketContext'

const useSocket = () => useContext(SocketContext)

export default useSocket