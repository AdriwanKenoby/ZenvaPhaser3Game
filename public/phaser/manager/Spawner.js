import { SpawnerType, randomNumber } from '../utils'
import ChestModel from './ChestModel'
import MonsterModel from './MonsterModel'

class Spawner {
  constructor (config, spwanLocations, addObject, deleteObject) {
    this.id = config.id
    this.spawnInterval = config.spawnInterval
    this.limit = config.limit
    this.objectType = config.objectType
    this.spwanLocations = spwanLocations
    this.addObject = addObject
    this.deleteObject = deleteObject

    this.objectsCreated = []

    this.start()
  }

  start () {
    this.interval = setInterval(() => {
      if (this.objectsCreated.length < this.limit) {
        this.spawnObject()
      }
    }, this.spawnInterval)
  }

  spawnObject () {
    if (this.objectType === SpawnerType.CHEST) {
      this.spawnChest()
    }

    if (this.objectType === SpawnerType.MONSTER) {
      this.spawnMonster()
    }
  }

  spawnChest () {
    const location = this.pickRandomLocation()
    const chest = new ChestModel(
      location[0],
      location[1],
      randomNumber(10, 20),
      this.id
    )
    this.objectsCreated.push(chest)
    this.addObject(chest.id, chest)
  }

  spawnMonster () {
    const location = this.pickRandomLocation()
    const monster = new MonsterModel(
      location[0],
      location[1],
      randomNumber(10, 20),
      this.id,
      randomNumber(0, 20),
      randomNumber(3, 5),
      1
    )
    this.objectsCreated.push(monster)
    this.addObject(monster.id, monster)
  }

  pickRandomLocation () {
    let location = this.spwanLocations[Math.floor(Math.random() * this.spwanLocations.length)]

    while (this.objectsCreated.some(obj => (obj.x === location[0] && obj.y === location[1]))) {
      location = this.spwanLocations[Math.floor(Math.random() * this.spwanLocations.length)]
    }

    return location
  }

  removeObject (id) {
    this.objectsCreated = this.objectsCreated.filter(obj => obj.id !== id)
    this.deleteObject(id)
  }
}

export default Spawner
