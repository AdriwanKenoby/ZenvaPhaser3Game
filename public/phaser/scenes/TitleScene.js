import Phaser from 'phaser'
import { SCALE_FACTOR } from '../config'
import UiButton from '../classes/UiButton'

class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title')
  }

  create () {
    // create the title text
    this.titleText = this.add.text(
      this.scale.width / SCALE_FACTOR,
      this.scale.height / SCALE_FACTOR,
      'Zenva MMORPG',
      { fontSize: '64px', fill: '#fff' }
    )
    this.titleText.setOrigin(0.5)

    // create the play Game button
    this.startGameButton = new UiButton(
      this,
      this.scale.width / SCALE_FACTOR,
      this.scale.height * 0.65,
      'button1',
      'button2',
      'Start',
      this.startScene.bind(this, 'Game')
    )
  }

  startScene (targetScene) {
    this.scene.start(targetScene)
  }
}

export default TitleScene
