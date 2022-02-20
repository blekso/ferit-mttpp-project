function getRandomInt () {
  return Math.floor(Math.random() * Math.floor(10000))
}

export const BradUser = {
  email: 'brad.gibson@example.com',
  password: 'Password#1234'
}

export const RandomBradUser = {
  firstname: 'Brad',
  lastname: 'Gibson',
  email: 'brad.gibson' + getRandomInt() + '@example.com',
  password: 'Password#1234!'
}
