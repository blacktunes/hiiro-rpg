Spriteset_Map.prototype.updateParallax = function () {
  if (this._parallaxName !== $gameMap.parallaxName()) {
    this._parallaxName = $gameMap.parallaxName()
    this._parallax.bitmap = ImageManager.loadParallax()
  }
  if (this._parallax.bitmap) {
    const bitmap = this._parallax.bitmap
    this._parallax.origin.x = $gameMap.parallaxOx() % bitmap.width
    this._parallax.origin.y = $gameMap.parallaxOy() % bitmap.height
  }
}

Sprite_Button.prototype.loadButtonImage = function () {
  this.bitmap = ImageManager._emptyBitmap
}

Sprite_Button.prototype.checkBitmap = function () { }

Sprite_Timer.prototype.updatePosition = function () {
  this.x = (Graphics.width - this.bitmap.width) / 2
  this.y = Graphics.boxHeight / 2
}
