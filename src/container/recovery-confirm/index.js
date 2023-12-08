import { Form, REG_EXP_PASSWORD } from '../../script/form'

import { saveSession } from '../../script/session'

class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'Enter value',
    IS_BIG: 'Value must be less than 30 symbols',
    PASSWORD: 'Sorry, the password is too simple',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG
    }

    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return this.FIELD_ERROR.PASSWORD
      }
    }
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      // this.setAlert('progress', 'Завантаження....')

      try {
        const res = await fetch('/recovery-confirm', {
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

          saveSession(data.session)

          // location.assign('/')
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
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
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

window.recoveryConfirmForm = new RecoveryConfirmForm()
