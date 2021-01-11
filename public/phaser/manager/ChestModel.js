import { v4 as uuidv4 } from 'uuid'

class ChestModel {
  constructor (x, y, gold, spawnerId) {
    this.id = `${spawnerId}-${uuidv4()}`
    this.spawnerId = spawnerId
    this.x = x
    this.y = y
    this.gold = gold
  }
}

export default ChestModel
