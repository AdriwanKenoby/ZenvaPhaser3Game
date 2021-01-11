import { INITIAL_HEALTH } from '../config'
import { v4 as uuidv4 } from 'uuid'

class PlayerModel {
  constructor (spawnLocations) {
    this.health = INITIAL_HEALTH
    this.maxHealth = INITIAL_HEALTH
    this.gold = 0
    this.id = `player-${uuidv4()}`
    const [x, y] = spawnLocations[Math.floor(Math.random() * spawnLocations.length)]
    this.x = x
    this.y = y
  }

  updateGold (gold) {
    this.gold += gold
  }
}

export default PlayerModel
