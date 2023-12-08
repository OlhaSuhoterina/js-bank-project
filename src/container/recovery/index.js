// import { text } from 'express'
import { Form, REG_EXP_EMAIL } from '../../script/form'

class RecoveryForm extends Form {
  FIELD_NAME = {
    EMAIL: 'email',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'Enter value',
    IS_BIG: 'Value must be less than 30 symbols',
    EMAIL: 'Please enter a valid email address',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG
    }

    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return this.FIELD_ERROR.EMAIL
      }
    }
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      this.setAlert('progress', 'Завантаження....')

      try {
        const res = await fetch('/recovery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)

          this.setbuttoN('success')
          this.setbutton('success')
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
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
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

window.recoveryForm = new RecoveryForm()
