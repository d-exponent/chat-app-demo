
class Notifification {
  constructor(setNotification) {
    this.setNotification = setNotification
  }

  hide() {
    this.setNotification(null)
  }

  show(status, message) {
    this.setNotification({ status, message })
  }
}

export default Notifification