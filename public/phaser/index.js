import Phaser from 'phaser'
import scenes from './scenes'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  pixelArt: true,
  roundPixels: true
}

const game = new Phaser.Game(config)
