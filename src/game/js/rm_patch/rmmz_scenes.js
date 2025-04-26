Scene_Boot.prototype.start = function () {
  Scene_Base.prototype.start.call(this)
  SoundManager.preloadImportantSounds()
  this.resizeScreen()
  this.updateDocumentTitle()
}

Scene_Boot.prototype.resizeScreen = function () {
  const screenWidth = $dataSystem.advanced.screenWidth
  const screenHeight = $dataSystem.advanced.screenHeight
  Graphics.resize(screenWidth, screenHeight)
  Graphics.defaultScale = this.screenScale()
  this.adjustBoxSize()
  this.adjustWindow()
  Components.Main.setup(Graphics.width, Graphics.height)
}

/** VUE主菜单适配 */
Scene_Title.prototype.create = function () {
  VueMain._current.push('MainMenu')
}

Scene_Title.prototype.start = function () {
  Scene_Base.prototype.start.call(this)
  SceneManager.clearStack()
  AudioManager.stopAll()
  this.playTitleMusic()
  Components.MainMenu.show = true
}

Scene_Title.prototype.update = function () { }

Scene_Title.prototype.isBusy = function () {
  return false
}

Scene_Title.prototype.terminate = function () {
  Scene_Base.prototype.terminate.call(this)
  AudioManager.stopAll()
  SceneManager.snapForBackground()
  if (this._gameTitleSprite) {
    this._gameTitleSprite.bitmap.destroy();
  }
  VueMain._current.pop()
}

/** VUE游戏菜单适配 */
Scene_Menu.prototype.create = function () {
  Scene_Base.prototype.create.call(this);
  this.createBackground()
  Methods.hideTip()
  Components.Movetip.hide()
  Components.GameMenu.show = true
  VueMain._current.push('GameMenu')
}

Scene_Menu.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this)
}

Scene_Menu.prototype.terminate = function () {
  Components.GameMenu.show = false
  VueMain._current.pop()
}

Scene_Map.prototype.create = function () {
  Scene_Message.prototype.create.call(this)
  this._transfer = $gamePlayer.isTransferring()
  this._lastMapWasNull = !$dataMap
  if (this._transfer) {
    DataManager.loadMapData($gamePlayer.newMapId())
    this.onTransfer()
  } else {
    DataManager.loadMapData($gameMap.mapId())
  }
  VueMain._current.push('Log')
}

Scene_Map.prototype.updateCallMenu = function () {
  if (this.isMenuEnabled()) {
    if (Components.Log.isHide && this.isMenuCalled()) {
      this.menuCalling = true
    }
    if (this.menuCalling && !$gamePlayer.isMoving()) {
      this.callMenu()
    }
  } else {
    this.menuCalling = false
  }
}

Scene_Map.prototype.callMenu = function () {
  // AudioManager.playSe({
  //   name: 'menu',
  //   pan: 0,
  //   pitch: 100,
  //   volume: 90
  // })
  SceneManager.push(Scene_Menu)
  Window_MenuCommand.initCommandPosition()
  $gameTemp.clearDestination()
  this._mapNameWindow.hide()
  this._waitCount = 2
}

Scene_Map.prototype.terminate = function () {
  Scene_Message.prototype.terminate.call(this)
  if (!SceneManager.isNextScene(Scene_Battle)) {
    this._spriteset.update()
    this._mapNameWindow.hide()
    this.hideMenuButton()
    SceneManager.snapForBackground()
  }
  $gameScreen.clearZoom()

  VueMain._current.pop()
}

Scene_Message.prototype.messageWindowRect = function () {
  const ww = Graphics.boxWidth
  const wh = this.calcWindowHeight(4, false) + 8
  const wx = 0
  const wy = -Graphics.boxHeight * 1.2
  return new Rectangle(wx, wy, ww, wh)
}