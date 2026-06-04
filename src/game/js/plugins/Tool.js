//-----------------------------------------------------------------------------
/*:
 * @plugindesc 插件工具类
 *
 * @target MZ
 * @author Blacktunes
 *
 * @command 切换滤镜
 * @text 切换滤镜
 * @desc 切换滤镜
 *
 * @arg filter
 * @text filter
 * @desc filter
 *
 * @command 还原滤镜
 * @text 还原滤镜
 * @desc 还原滤镜
 *
 * @command 聚焦到事件
 * @text 聚焦到事件
 * @desc 聚焦到事件
 *
 * @arg id
 * @default 0
 * @text ID
 * @type number
 * @desc 需要聚焦的ID
 *
 * @arg scale
 * @default 3
 * @text scale
 * @type number
 * @desc 放大倍数
 *
 * @arg time
 * @default 30
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 还原聚焦
 * @text 还原聚焦
 * @desc 还原聚焦
 *
 * @arg time
 * @default 30
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 重置立绘
 * @text 重置立绘
 * @desc 重置立绘
 *
 * @command 不消除对话框
 * @text 不消除对话框
 * @desc 不消除对话框
 *
 * @arg flag
 * @default false
 * @text flag
 * @type boolean
 *
 * @command 设置提示
 * @text 设置提示
 * @desc 设置提示
 *
 * @arg en
 * @text en
 * @desc 英文提示
 *
 * @arg cn
 * @text cn
 * @desc 中文提示
 *
 * @arg time
 * @default 3000
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 消除提示
 * @text 消除提示
 * @desc 消除提示
 *
 * @command 设置支线提示
 * @text 设置支线提示
 * @desc 设置支线提示
 *
 * @arg en
 * @text en
 * @desc 英文提示
 *
 * @arg cn
 * @text cn
 * @desc 中文提示
 *
 * @arg time
 * @default 3000
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 消除支线提示
 * @text 消除支线提示
 * @desc 消除支线提示
 *
 * @command 临时提示
 * @text 临时提示
 * @desc 临时提示
 *
 * @arg en
 * @text en
 * @desc 英文提示
 *
 * @arg cn
 * @text cn
 * @desc 中文提示
 *
 * @arg time
 * @default 3000
 * @text time
 * @type number
 * @desc 持续时间
 *
 * @command 保存周目存档
 * @text 保存周目存档
 * @desc 保存周目存档
 *
 * @arg next
 * @text NEXT
 * @type number
 * @desc 下一章节
 *
 * @command 解锁成就
 * @text 解锁成就
 * @desc 解锁成就
 *
 * @arg id
 * @text ID
 * @type string
 * @desc 成就ID
 *
 * @command 对话等待
 * @text 对话等待
 * @desc 对话等待
 *
 * @arg time
 * @text time
 * @default 60
 * @type number
 * @desc 等待时长
 */

void function () {
  const list = {
    切换滤镜: ({ filter }) => {
      document.getElementById('gameCanvas').style.filter = filter
    },
    还原滤镜: () => {
      document.getElementById('gameCanvas').style.filter = ''
    },
    聚焦到事件: ({ id, scale, time }) => {
      Galv.ZOOM.target(Number(id), Number(scale), Number(time))
    },
    还原聚焦: ({ time }) => {
      Galv.ZOOM.restore(Number(time))
    },
    重置立绘: () => {
      Components.Message.resetCharacter()
    },
    不消除对话框: ({ flag }) => {
      Components.Message.message.noHide = eval(flag)
    },
    设置提示: ({ en, cn, time }) => {
      Methods.showTip(en, cn, Number(time))
    },
    消除提示: () => {
      Methods.clearTip()
    },
    设置支线提示: ({ en, cn, time }) => {
      Methods.showTip(en, cn, Number(time), true)
    },
    消除支线提示: () => {
      Methods.clearTip(true)
    },
    临时提示: ({ en, cn, time }) => {
      Components.Tip.tempTip(en, cn, Number(time), true)
    },
    保存周目存档: ({ next }) => {
      next = Number(next)
      if (Patch.loopData.next) {
        if (Patch.loopData.next < next && next !== 5) {
          Patch.loopData.next = next
        }
        if (next !== 5 || !Patch.loopData.end) {
          Patch.loopData.lock = true
        }
        if (next !== 5) {
          Patch.loopData.skip = true
        } else {
          Patch.loopData.end = true
        }
        Patch.loopData._next = next
        Patch.saveLoopData()
      } else {
        Patch.addLoopData({
          _next: 1,
          next: 1,
          lock: true,
          skip: true,
          // restart: true,
          load: true,
          newGame: false
        })
      }
      $gameSystem.onBeforeSave()
      DataManager.saveGame(next + 100)
    },
    解锁成就: ({ id }) => {
      Steam.activateAchievement(id)
    },
    对话等待: ({ time }) => {
      SceneManager._scene._messageWindow.startWait(Number(time))
      SceneManager._scene._messageWindow._pauseSkip = true
    }
  }

  for (const name in list) {
    PluginManager.registerCommand('Tool', name, arg => {
      list[name](arg)
    })
  }
}()
