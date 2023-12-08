import { Form } from '../../script/form'

import {
  saveSession,
  getTokenSession,
  getSession,
} from '../../script/session'

class SignupConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'Enter value',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      console.log(this.value)

      try {
        const res = await fetch('/signup-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
          saveSession(data.session)

          this.setbuttoN('success')
          this.setbutton('success')

          location.assign('/')
          // alert(data.session.token)
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      token: getTokenSession(),
    })
  }

  setAlert = (status, text) => {
    const el = document.querySelector(`.alert`)

    if (status === 'progress') {
      el.className = 'alert alert-progress'
    } else if (status === 'success') {
      el.className = 'alert alert-success'
    } else if (status === 'error') {
      el.className = 'alert alert-error'
    } else {
      el.className = 'alert alert-disabled'
    }

    if (text) el.innerText = text
  }

  setbuttoN = (status, text) => {
    const el = document.querySelector(`.buttoN`)

    if (status === 'success') {
      el.className = 'buttoN buttoN-success'
    } else {
      el.className = 'buttoN buttoN-disabled'
    }
    if (text) el.innerText = text
  }

  setbutton = (status, text) => {
    const el = document.querySelector(`.button`)

    if (status === 'success') {
      el.className = 'button button-disabled'
    }
    if (text) el.innerText = text
  }
}

window.signupConfirmForm = new SignupConfirmForm()

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.session) {
      if (window.session.user.isConfirm) {
        location.assign('/')
      }
    } else {
      location.assign('/')
    }
  } catch (e) {}

  document
    .querySelector('#renew')
    .addEventListener('click', (e) => {
      e.preventDefault()

      const session = getSession()

      location.assign(
        `/signup-confirm?renew=true&email=${session.user.email}`,
      )
    })
})
