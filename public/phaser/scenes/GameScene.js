import Phaser from 'phaser'
import Player from '../classes/Player'
import GameMap from '../classes/GameMap'
import Chest from '../classes/Chest'
import GameManager from '../manager/GameManager'
import { SCALE_FACTOR } from '../config'
import Monster from '../classes/Monster'

class GameScene extends Phaser.Scene {
  constructor () {
    super('Game')
  }

  init () {
    this.scene.launch('Ui')
  }

  create () {
    this.createAudio()
    this.createMap()
    this.createGroups()
    this.cursors = this.input.keyboard.createCursorKeys()
    this.createGameManager()
  }

  update () {
    if (this.player) this.player.update(this.cursors)
  }

  createAudio () {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.3 })
    this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.01 })
    this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 })
    this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 })
    this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 })
  }

  createMap () {
    this.gameMap = new GameMap(this, 'map', 'background', 'background', 'blocked', 'chest_locations')
  }

  createPlayer (playerModel) {
    this.player = new Player(
      this, playerModel.x * SCALE_FACTOR,
      playerModel.y * SCALE_FACTOR,
      'characters',
      0,
      playerModel.health,
      playerModel.maxHealth,
      playerModel.id
    )
  }

  addCollisions () {
    this.physics.add.collider(this.player, this.gameMap.blockedLayer)
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this)
    this.physics.add.collider(this.monsters, this.gameMap.blockedLayer)
    this.physics.add.overlap(this.player, this.monsters, this.enemyOverlap, null, this)
  }

  enemyOverlap (player, enemy) {
    enemy.makeInactive()
    this.events.emit('destroyEnemy', enemy.id)
  }

  createGroups () {
    this.chests = this.physics.add.group()
    this.monsters = this.physics.add.group()
  }

  spawnChest (chestModel) {
    let chest = this.chests.getFirstDead()
    if (!chest) {
      chest = new Chest(
        this,
        chestModel.x * SCALE_FACTOR,
        chestModel.y * SCALE_FACTOR,
        'items',
        0,
        chestModel.gold,
        chestModel.id
      )
      this.chests.add(chest)
    } else {
      chest.coins = chestModel.gold
      chest.id = chestModel.id
      chest.setPosition(chestModel.x * SCALE_FACTOR, chestModel.y * SCALE_FACTOR)
      chest.makeActive()
    }
  }

  collectChest (player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play()
    this.events.emit('pickUpChest', chest.id, player.id)
  }

  spawnMonster (monsterModel) {
    let monster = this.monsters.getFirstDead()
    if (!monster) {
      monster = new Monster(
        this,
        monsterModel.x * SCALE_FACTOR,
        monsterModel.y * SCALE_FACTOR,
        'monsters',
        monsterModel.frame,
        monsterModel.id,
        monsterModel.health,
        monsterModel.maxHealth
      )
      this.monsters.add(monster)
    } else {
      monster.id = monsterModel.id
      monster.health = monsterModel.health
      monster.maxHealth = monsterModel.maxHealth
      monster.setTexture('monsters', monsterModel.frame)
      monster.setPosition(monsterModel.x * SCALE_FACTOR, monsterModel.y * SCALE_FACTOR)
      monster.makeActive()
    }
  }

  createGameManager () {
    this.events.on('spawnPlayer', player => {
      this.createPlayer(player)
      this.addCollisions()
    })

    this.events.on('spawnChest', chest => {
      this.spawnChest(chest)
    })

    this.events.on('spawnMonster', monster => {
      this.spawnMonster(monster)
    })

    this.events.on('removeChest', chestId => {
      this.chests.getChildren()
        .filter(chest => chest.id === chestId)
        .forEach(chest => chest.makeInactive())
    })

    this.gameManager = new GameManager(this, this.gameMap.tilemap.objects)
    this.gameManager.setup()
  }
}

export default GameScene
