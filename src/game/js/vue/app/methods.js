global.Methods = class {
  static setTitleColor(color) {
    Components.TitleBar.color = color
  }

  static setTitle(title) {
    Components.TitleBar.title = title
  }

  static showTip(en, cn, time, other) {
    Components.Tip?.showTip(en, cn, time, other)
  }

  static hideTip() {
    Components.Tip.hideTip()
  }

  static clearTip(other) {
    Components.Tip.clear(other)
  }

  static getTipState() {
    return Components.Tip?.show
  }

  static showPopup(en, cn, time) {
    return Components.Popup?.show(en, cn, time)
  }

  static hidePopup() {
    Components.Popup.hide()
  }

  static showChoice(en, cn, fn, cb) {
    Components.Choice.showChoice(en, cn, fn, cb)
  }

  static getChapter(num) {
    switch (num) {
      case 3:
        return 3.5
        case 4:
        if (Patch.loopData.end) {
          return 0
        } else {
          return '4?'
        }
      case 5:
        return 0
      case 999:
        return '4?'
      default:
        return num + 1
    }
  }
}
