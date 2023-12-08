class User {
  static #list = []

  static #count = 1

  constructor({ email, password, balance }) {
    this.id = User.#count++

    this.email = String(email).toLocaleLowerCase()
    this.password = String(password)
    this.isConfirm = false
    this.balance = balance
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)

    console.log(this.#list)

    return user
  }

  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLocaleLowerCase(),
      ) || null
    )
  }

  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  //   static getList = () => this.#list
}

module.exports = {
  User,
}