/** 额外添加的RM方法 */
const Patch = class {
  static startWait() {
    Game_Interpreter.prototype._wait = true
  }
  static stopWait() {
    Game_Interpreter.prototype._wait = false
  }

  /** 打开URL */
  static openUrl(url) {
    electron.shell.openExternal(url)
  }

  static loopData = {}

  static saveLoopData = async function () {
    await StorageManager.saveObject("hirro", this.loopData)
  }

  static loadLoopData = async function () {
    try {
      this.loopData = await StorageManager.loadObject("hirro")
    } catch (_e) {
      this.loopData = {}
    }
  }

  /** 增加全局存档数据 */
  static addLoopData(obj) {
    this.loopData = { ...this.loopData, ...obj }
    this.saveLoopData()
  }

  /** 清空周目数据 */
  static delLoop() {
    this.loopData = {}
    this.saveLoopData()
  }

  static async save(id) {
    $gameSystem.onBeforeSave()
    try {
      await DataManager.saveGame(id)
      Methods.showPopup('Save success', '保存成功', 1000)
    } catch (e) {
      Methods.showPopup('Save failed', '保存失败', 1000)
    }
  }

  static checkSave() {
    return DataManager.savefileExists(1) || DataManager.savefileExists(2) || DataManager.savefileExists(3) || DataManager.savefileExists(4) || DataManager.savefileExists(5)
  }

  static showTip(time) {
    if ($gameSystem.tipData) {
      Methods.showTip($gameSystem.tipData.en, $gameSystem.tipData.cn, time ?? $gameSystem.tipData.time)
    }
  }

  /**
   * @deprecated
   */
  static restart() {
    SceneManager.goto(null)
    document.getElementById('gameCanvas').style.opacity = 0
    AudioManager.stopAll()
    setTimeout(() => {
      // 第一章需取消注释
      // const frameCount = $gameSystem._framesOnSave
      DataManager.setupNewGame()
      SceneManager.goto(Scene_Map)
      // Graphics.frameCount = frameCount
      Components.Loading.loadingHide()
      $gameTemp.reserveCommonEvent(99)
    }, 400)
  }

  static changeFullscreen(fullscreen) {
    Components.TitleBar.show = !fullscreen
    const top = fullscreen ? 0 : 30

    Graphics._canvas.style.top = `${top}px`
    Video._element.style.top = `${top}px`
    document.getElementById('fpsCounterBox').style.top = `${top}px`
    document.getElementById('fpsCounterBox').style.top = `${top}px`

    VueMain.app.main.top = top
  }

  static checkAudio(folder, audio) {
    const name = audio?.name
    if (!name) return false
    const ext = AudioManager.audioFileExt()
    const filename = dev ? (name + ext) : md5(name + ext).substr(8, 16)
    const url = AudioManager._path + (dev ? folder : md5Url(folder)) + filename
    return fs.existsSync(path.join(path.dirname(__filename), url))
  }
}

Patch.loadLoopData()

/** 插件方法 */
const Plugins = class {
  static focusToID(id, scale, time) {
    Galv.ZOOM.target(id, scale, time)
  }

  static blur(time) {
    Galv.ZOOM.restore(time)
  }
}

const Steam = class {
  static activateAchievement(name) {
    electron.ipcRenderer.send('steam:achievement', name)
  }
}