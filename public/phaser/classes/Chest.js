import Phaser from 'phaser'
import { SCALE_FACTOR } from '../config'

class Chest extends Phaser.Physics.Arcade.Image {
  constructor (scene, x, y, key, frame, coins, id) {
    super(scene, x, y, key, frame)
    this.coins = coins // the amount of coins this chest contains
    this.id = id

    // enable physics
    scene.physics.world.enable(this)
    // add the player to our existing scene
    scene.add.existing(this)
    // scale the chest game object
    this.setScale(SCALE_FACTOR)
  }

  makeActive () {
    this.setActive(true)
    this.setVisible(true)
    this.body.checkCollision.none = false
  }

  makeInactive () {
    this.setActive(false)
    this.setVisible(false)
    this.body.checkCollision.none = true
  }
}

export default Chest
