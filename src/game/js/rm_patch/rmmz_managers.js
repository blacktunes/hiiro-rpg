SceneManager.updateFrameCount = function () {
  Graphics.frameCount++
  Components.GameMenu.setTime()
}

StorageManager.isLocalMode = function () {
  return true
}

StorageManager.fileDirectoryPath = function () {
  let base = __dirname
  if (base.includes('app.asar')) {
    base = __dirname.replace('app.asar', 'app.asar.unpacked')
  }
  return path.join(base, '../icu/')
}

StorageManager.filePath = function (saveName) {
  const dir = this.fileDirectoryPath()
  return dir + saveName
}

DataManager.saveGame = async function (savefileId) {
  Components.Main.save.show = true

  const contents = this.makeSaveContents()
  const saveName = this.makeSavename(savefileId)
  await StorageManager.saveObject(saveName, contents)
  return 0
}

StorageManager.saveToLocalFile = function (saveName, zip) {
  const dirPath = this.fileDirectoryPath()
  const filePath = this.filePath(saveName)
  const backupFilePath = filePath + '_'
  return new Promise((resolve, reject) => {
    this.fsMkdir(dirPath)
    this.fsUnlink(backupFilePath)
    this.fsRename(filePath, backupFilePath)
    try {
      this.fsWriteFile(filePath, zip)
      this.fsUnlink(backupFilePath)
      resolve()
    } catch (e) {
      try {
        this.fsUnlink(filePath)
        this.fsRename(backupFilePath, filePath)
      } catch (e2) {
        //
      }
      reject(e)
    } finally {
      if (Components.Main.save.show) {
        Components.Main.save.show = false
        if (Components.GameMenu.show) {
          Components.GameMenu.checkSave()
        }
      }
    }
  })
}

ConfigManager.touchUI = false

Object.defineProperty(ConfigManager, 'touchUI', {
  get: function () {
    return false
  },
  configurable: true
})

ConfigManager.save = function () {
  StorageManager.saveObject('niiro', this.makeData())
}

ConfigManager.makeData = function () {
  const config = {}
  config.alwaysDash = this.alwaysDash
  config.commandRemember = this.commandRemember
  config.touchUI = this.touchUI
  config.bgmVolume = this.bgmVolume
  config.bgsVolume = this.bgsVolume
  config.meVolume = this.meVolume
  config.seVolume = this.seVolume
  config.fullscreen = this.fullscreen
  return config
}

ConfigManager.load = function () {
  StorageManager.loadObject('niiro')
    .then(config => this.applyData(config || {}))
    .catch(() => 0)
    .then(() => {
      Patch.changeFullscreen(electron.ipcRenderer.sendSync('app:fullscreen', ConfigManager.fullscreen ?? false))

      this._isLoaded = true
      return 0
    })
    .catch(() => 0)
}

ConfigManager.applyData = function (config) {
  this.alwaysDash = this.readFlag(config, 'alwaysDash', false)
  this.commandRemember = this.readFlag(config, 'commandRemember', false)
  this.touchUI = this.readFlag(config, 'touchUI', true)
  this.bgmVolume = this.readVolume(config, 'bgmVolume')
  this.bgsVolume = this.readVolume(config, 'bgsVolume')
  this.meVolume = this.readVolume(config, 'meVolume')
  this.seVolume = this.readVolume(config, 'seVolume')
  this.fullscreen = this.readFlag(config, 'fullscreen', false)
}

DataManager._globalInfo = []
DataManager.saveGlobalInfo = function () { }

DataManager.loadGlobalInfo = function () {
  return 0
}

DataManager.makeSavename = function (savefileId) {
  let temp = ''
  savefileId = Number(savefileId) ?? 0
  if (savefileId === 1) {
    return 'hiiro'
  }
  if (savefileId > 100) {
    savefileId -= 100
    for (let i = 0; i <= savefileId; i++) {
      temp += 'i'
    }
    return `hi${temp}ro`
  }
  return `test-${savefileId}`
}

SceneManager.onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey) {
    switch (event.keyCode) {
      case 116: // F5
        electron.ipcRenderer.send('app:reload')
        break
      case 123: // F12
        electron.ipcRenderer.send('dev:tool')
        break
    }
  }
}

ImageManager.loadBitmap = function (folder, filename) {
  if (filename) {
    const _filename = dev ? (Utils.encodeURI(filename) + '.png') : md5(filename + '.png').substr(8, 16)
    const url = md5Url(folder) + _filename
    return this.loadBitmapFromUrl(url)
  } else {
    return this._emptyBitmap
  }
}

ImageManager.loadBitmapFromUrl = function (url) {
  const cache = url.includes(dev ? '/system/' : `/${md5('system').substr(8, 16)}/`) ? this._system : this._cache
  if (!cache[url]) {
    cache[url] = Bitmap.load(url)
  }
  return cache[url]
}

AudioManager._bgmVolume = 50
AudioManager._bgsVolume = 50
AudioManager._meVolume = 50
AudioManager._seVolume = 50
AudioManager._path = dev ? 'audio/' : `${md5('audio').substr(8, 16)}/`

AudioManager.createBuffer = function (folder, name) {
  const ext = this.audioFileExt()
  const filename = dev ? (Utils.encodeURI(name) + ext) : md5(name + ext).substr(8, 16)

  const url = this._path + (dev ? folder : md5Url(folder)) + filename
  const buffer = new WebAudio(url)
  buffer.name = name
  buffer.frameCount = Graphics.frameCount
  return buffer
}
