Game_Interpreter.prototype.isRunning = function () {
  return this._wait || !!this._list
}

Game_Interpreter.prototype.update = function () {
  while (this.isRunning()) {
    if (this._wait) {
      break
    }
    if (this.updateChild() || this.updateWait()) {
      break
    }
    if (SceneManager.isSceneChanging()) {
      break
    }
    if (!this.executeCommand()) {
      break
    }
    if (this.checkFreeze()) {
      break
    }
  }
}

Game_Interpreter.prototype.command101 = function (params) {
  if ($gameMessage.isBusy()) {
    return false
  }

  $gameMessage.setFaceImage(params[0], params[1])
  $gameMessage.setBackground(params[2])
  $gameMessage.setPositionType(params[3])
  $gameMessage.setSpeakerName(params[4])

  while (this.nextEventCode() === 401) {  // Text data
    this._index++
    Components.Message.add(401, this.currentCommand().parameters[0])
    $gameMessage.add(this.currentCommand().parameters[0])
  }
  switch (this.nextEventCode()) {
    case 102:  // Show Choices
      this._index++
      this.setupChoices(this.currentCommand().parameters)
      break
    case 103:  // Input Number
      this._index++
      this.setupNumInput(this.currentCommand().parameters)
      break
    case 104:  // Select Item
      this._index++
      this.setupItemChoice(this.currentCommand().parameters)
      break
    case 119:
      Components.Message.message._noHide = true
      break
    default:
      Components.Message.message._noHide = false
  }
  this._index++
  this.setWaitMode('message')
  Components.Message.showMsg()
  return false
}

Game_Interpreter.prototype.command201 = function (params) {
  if ($gameParty.inBattle() || $gameMessage.isBusy()) {
    return false
  }
  let mapId, x, y
  if (params[0] === 0) {
    // Direct designation
    mapId = params[1]
    x = params[2]
    y = params[3]
  } else {
    // Designation with variables
    mapId = $gameVariables.value(params[1])
    x = $gameVariables.value(params[2])
    y = $gameVariables.value(params[3])
  }
  $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5])
  Components.Message.resetCharacter()
  this.setWaitMode("transfer")
  Components.Movetip.hide()
  return true
}

Game_Interpreter.prototype.command115 = function () {
  this._index = this._list?.length || 0
  return true
}

Game_Interpreter.prototype.setupChoices = function (params) {
  const choices = params[0].clone()
  const cancelType = params[1] < choices.length ? params[1] : -2
  const defaultType = params.length > 2 ? params[2] : 0
  const positionType = params.length > 3 ? params[3] : 2
  const background = params.length > 4 ? params[4] : 0
  $gameMessage.setChoices(choices, defaultType, cancelType)
  Components.Message.setChoices(choices, defaultType, cancelType)
  $gameMessage.setChoiceBackground(background)
  $gameMessage.setChoicePositionType(positionType)
  $gameMessage.setChoiceCallback(n => {
    this._branch[this._indent] = n
  })
}

Game_Message.prototype.isBusy = function () {
  const busy = (this.hasText() || this.isChoice() ||
    this.isNumberInput() || this.isItemChoice())
  if (!busy) {
    Components.Message.reset()
  }
  return busy
}

Game_Map.prototype.setup = function (mapId) {
  if (!$dataMap) {
    throw new Error("The map data is not available")
  }
  this._mapId = mapId
  this._tilesetId = $dataMap.tilesetId == 7 ? 8 : $dataMap.tilesetId
  this._displayX = 0
  this._displayY = 0
  this.refereshVehicles()
  this.setupEvents()
  this.setupScroll()
  this.setupParallax()
  this.setupBattleback()
  this._needsRefresh = false
}

Game_Map.prototype.isEventRunning = function () {
  const eventRunning = this._interpreter.isRunning() || this.isAnyEventStarting()
  if (!eventRunning) {
    Components.Message.resetMultiline()
    Components.Message.resetCharacter()
    $gameSystem?.showEventNames?.()
  } else {
    $gameSystem?.hideEventNames?.()
  }
  return eventRunning
}

Game_Map.prototype.tileEventsXy = function (x, y) {
  return this.tileEvents?.filter(function (event) {
    return event.posNt(x, y)
  }) || []
}

// 修改奔跑速度
Game_CharacterBase.prototype.realMoveSpeed = function () {
  return this._moveSpeed + (this.isDashing() ? 1.25 : 0)
}

Game_Interpreter.prototype.command261 = function (params) {
  if ($gameMessage.isBusy()) {
    return false
  }
  let name = params[0]
  if (name.length > 0) {
    const ext = this.videoFileExt()
    const videoPath = dev ? 'movies/' : `${md5('movies').substr(8, 16)}/`
    if (dev) {
      name = name + ext
    } else {
      name = md5(name + ext).substr(8, 16)
    }
    Video.play(videoPath + name)
    this.setWaitMode('video')
  }
  return true
}

Game_Interpreter.prototype.videoFileExt = function () {
  return '.webm'
}
