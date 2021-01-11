import { SpawnerType } from '../utils'
import PlayerModel from './PlayerModel'
import Spawner from './Spawner'

class GameManager {
  constructor (scene, mapData) {
    this.scene = scene
    this.mapData = mapData

    this.chests = new Map()
    this.monsters = new Map()
    this.players = new Map()
    this.spawners = new Map()

    this.chestLocations = new Map()
    this.monsterLocations = new Map()
    this.playerLocations = []
  }

  setup () {
    this.parseMapData()
    this.setupEventsListeners()
    this.setupSpawners()
    this.spawnPlayer()
  }

  parseMapData () {
    this.mapData.forEach(layer => {
      if (layer.name === 'player_locations') {
        layer.objects.forEach(obj => this.playerLocations.push([obj.x + obj.width / 2, obj.y - obj.height / 2]))
      }

      if (layer.name === 'chest_locations') {
        layer.objects.forEach(obj => {
          if (this.chestLocations.get(obj.properties.spawner)) {
            this.chestLocations.get(obj.properties.spawner).push([obj.x + obj.width / 2, obj.y - obj.height / 2])
          } else {
            this.chestLocations.set(obj.properties.spawner, [[obj.x + obj.width / 2, obj.y - obj.height / 2]])
          }
        })
      }

      if (layer.name === 'monster_locations') {
        layer.objects.forEach(obj => {
          if (this.monsterLocations.get(obj.properties.spawner)) {
            this.monsterLocations.get(obj.properties.spawner).push([obj.x + obj.width / 2, obj.y - obj.height / 2])
          } else {
            this.monsterLocations.set(obj.properties.spawner, [[obj.x + obj.width / 2, obj.y - obj.height / 2]])
          }
        })
      }
    })
  }

  setupEventsListeners () {
    this.scene.events.on('pickUpChest', (chestId, playerId) => {
      // update the spawner
      if (this.chests.get(chestId)) {
        // update our score
        const { gold } = this.chests.get(chestId)
        this.players.get(playerId).updateGold(gold)
        // update score in the ui
        this.scene.events.emit('updateScore', this.players.get(playerId).gold)

        // removing the chest
        this.spawners.get(this.chests.get(chestId).spawnerId).removeObject(chestId)
        this.scene.events.emit('removeChest', chestId)
      }
    })

    this.scene.events.on('destroyEnemy', (enemyId) => {
      // update the spawner
      if (this.monsters.get(enemyId)) {
        // removing the chest
        this.spawners.get(this.monsters.get(enemyId).spawnerId).removeObject(enemyId)
      }
    })
  }

  setupSpawners () {
    const config = {
      spawnInterval: 3000,
      limit: 3,
      objectType: SpawnerType.CHEST,
      id: ''
    }

    let spawner

    this.chestLocations.forEach((value, key) => {
      config.id = `chest-${key}`

      spawner = new Spawner(
        config,
        value,
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      )

      this.spawners.set(spawner.id, spawner)
    })

    this.monsterLocations.forEach((value, key) => {
      config.id = `monster-${key}`
      config.objectType = SpawnerType.MONSTER

      spawner = new Spawner(
        config,
        value,
        this.addMonster.bind(this),
        this.deleteMonster.bind(this)
      )

      this.spawners.set(spawner.id, spawner)
    })
  }

  spawnPlayer () {
    const player = new PlayerModel(this.playerLocations)
    this.players.set(player.id, player)
    this.scene.events.emit('spawnPlayer', player)
  }

  addChest (id, chest) {
    this.chests.set(id, chest)
    this.scene.events.emit('spawnChest', chest)
  }

  deleteChest (id) {
    this.chests.delete(id)
  }

  addMonster (id, monster) {
    this.monsters.set(id, monster)
    this.scene.events.emit('spawnMonster', monster)
  }

  deleteMonster (id) {
    this.monsters.delete(id)
  }
}

export default GameManager
