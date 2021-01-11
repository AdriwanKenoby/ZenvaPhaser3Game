import { SCALE_FACTOR } from '../config'

class GameMap {
  constructor (scene, key, tileSetName, bgLayerName, blockedLayerName, chestLocations) {
    this.scene = scene
    this.key = key
    this.tileSetName = tileSetName
    this.bgLayerName = bgLayerName
    this.blockedLayerName = blockedLayerName
    this.chestLocations = chestLocations
    this.createMap()
  }

  createMap () {
    // create the tile map
    this.tilemap = this.scene.make.tilemap({ key: this.key })
    // add the tileset image to our map
    this.tiles = this.tilemap.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2)
    // create our background
    this.backgroundLayer = this.tilemap.createLayer(this.bgLayerName, this.tiles)
    this.backgroundLayer.setScale(SCALE_FACTOR)

    // create blocked layer
    this.blockedLayer = this.tilemap.createLayer(this.blockedLayerName, this.tiles)
    this.blockedLayer.setScale(SCALE_FACTOR)
    this.blockedLayer.setCollisionByExclusion([-1])

    // update the world bounds
    this.scene.physics.world.bounds.width = this.tilemap.widthInPixels * SCALE_FACTOR
    this.scene.physics.world.bounds.height = this.tilemap.heightInPixels * SCALE_FACTOR

    // limit the camera to the size of our map
    this.scene.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels * SCALE_FACTOR, this.tilemap.heightInPixels * SCALE_FACTOR)
  }
}

export default GameMap
