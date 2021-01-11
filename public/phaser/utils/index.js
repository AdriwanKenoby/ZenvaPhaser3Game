import SpawnerType from './SpawnerType'

function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export {
  SpawnerType,
  randomNumber
}
