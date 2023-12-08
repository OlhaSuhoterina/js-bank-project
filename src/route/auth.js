// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'test@gmail.com',
  password: 'Testing193!',
  balance: 100,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/welcome', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('welcome', {
    // вказуємо назву контейнера
    name: 'welcome',
    // вказуємо назву компонентів
    component: ['header-light'],

    // вказуємо назву сторінки
    title: 'Welcome page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'header-dark',
      'back-button',
      'field',
      'field-password',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/signup', function (req, res) {
  const { email, password } = req.body

  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. Enter value',
    })
  }
  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'A user with the same name is already exist',
      })
    }

    const newuser = User.create({ email, password })

    const session = Session.create(newuser)

    Confirm.create(newuser.email)

    return res.status(200).json({
      message: 'The user is registered',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error, user not registered',
    })
  }
})

// ================================================================

router.get('/signup-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }

  console.log(renew, email)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: ['header-dark', 'back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Signup-confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Error! Fill in the fields',
    })
  }

  console.log(code, token)

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Im sorry. You are not logged in',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'No code',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Email confirmed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================
router.get('/signin', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signin', {
    // вказуємо назву контейнера
    name: 'signin',
    // вказуємо назву компонентів
    component: [
      'header-dark',
      'back-button',
      'field',
      'field-password',
    ],

    // вказуємо назву сторінки
    title: 'Signin page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/signin', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. Enter value',
    })
  }

  console.log(email, password)

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error. There is no user with this emai',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Error!. Password incorrect',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'You are entered in to your account',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['header-dark', 'back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// =====================================
router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Error. Enter value',
    })
  }
  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error! There is no user with this emai',
      })
    }
    Confirm.create(email)

    return res.status(200).json({
      message: 'Сode sent!',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})
// =====================================

router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: [
      'header-dark',
      'back-button',
      'field',
      'field-password',
    ],

    // вказуємо назву сторінки
    title: 'Recovery confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// =====================================
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Error. Enter value',
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'No code',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error! There is no user with this emai',
      })
    }

    user.password = password

    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password changed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})
// =====================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/balance', function (req, res) {
  const { id, email, balance } = req.query

  const user = User.getByEmail(Number(email), {
    id,
    balance,
  })

  console.log(id, balance)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('balance', {
    // вказуємо назву контейнера
    name: 'balance',
    // вказуємо назву компонентів
    component: ['header-light', 'heading-menu'],

    // вказуємо назву сторінки
    title: 'balance page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: { id, email, balance },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
