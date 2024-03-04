import { createPortal } from 'react-dom'
import useNotification from '../../hooks/useNotification'

import './styles.css'

const Notifification = () => {
  const { content } = useNotification()

  if (!content) return null

  return createPortal(
    <div className={`notification ${content.status} `}>
      <p>{content.message}</p>
    </div>,
    document.getElementById('notification')
  )
}

export default Notifification