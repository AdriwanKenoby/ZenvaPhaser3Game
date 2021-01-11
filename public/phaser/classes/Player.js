import Phaser from 'phaser'
import { SCALE_FACTOR } from '../config'

class Player extends Phaser.Physics.Arcade.Image {
  constructor (scene, x, y, key, frame, health, maxHealth, id) {
    super(scene, x, y, key, frame)
    this.velocity = 160 // the velocity when moving our player
    this.score = 0
    this.health = health
    this.maxHealth = maxHealth
    this.id = id
    // enable physics
    scene.physics.world.enable(this)
    // set immovable if another object collides with our player
    this.setImmovable(false)
    // scale our player
    this.setScale(SCALE_FACTOR)
    // collide with world bounds
    this.setCollideWorldBounds(true)
    // add the player to our existing scene
    scene.add.existing(this)
    // have the camera follow the player
    this.scene.cameras.main.startFollow(this, true)
  }

  update (cursors) {
    this.setVelocity(0)
    if (cursors.left.isDown) {
      this.setVelocityX(-this.velocity)
    }
    if (cursors.right.isDown) {
      this.setVelocityX(this.velocity)
    }

    if (cursors.up.isDown) {
      this.setVelocityY(-this.velocity)
    }

    if (cursors.down.isDown) {
      this.setVelocityY(this.velocity)
    }
  }
}

export default Player
