<template>
  <div>
    <transition name="fade">
      <div class="setting-wrapper" v-if="show">
        <div class="setting-frame">
          <!-- <div class="setting-title">
            <div>设置 Setting</div>
          </div> -->
          <div class="setting">
            <div
              class="arrow"
              :style="{
                top: `${top}px`,
                backgroundImage: `url('${bgUrl}')`
              }"
            ></div>
            <div class="item" :class="{ 'setting-highlight': current === 0 }" ref="fullscreen">
              <div class="text">
                <div class="en">FullScreen</div>
                <div class="cn">全屏</div>
              </div>
              <div class="switch">
                <transition name="switch">
                  <div v-if="fullscreen">
                    <div style="font-size: 30px">○</div>
                  </div>
                </transition>
                <transition name="switch">
                  <div v-if="!fullscreen">
                    <div style="font-size: 36px">×</div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="item" :class="{ 'setting-highlight': current === 1 }" ref="run">
              <div class="text">
                <div class="en">Always Dash</div>
                <div class="cn">持续奔跑</div>
              </div>
              <div class="switch">
                <transition name="switch">
                  <div v-if="keepRunning">
                    <div style="font-size: 30px">○</div>
                  </div>
                </transition>
                <transition name="switch">
                  <div v-if="!keepRunning">
                    <div style="font-size: 36px">×</div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="item" :class="{ 'setting-highlight': current === 2 }" ref="bgm">
              <div class="text">
                <div class="en">BGM Volume</div>
                <div class="cn">背景音量</div>
              </div>
              <div class="slider">
                <div
                  v-for="i in 10"
                  :key="'bgm' + i"
                  class="block"
                  :style="{
                    backgroundImage: i <= bgm ? `url('${volUrl}')` : `url('${vol0Url}')`
                  }"
                ></div>
              </div>
              <div class="percent">{{ _bgm }}%</div>
            </div>
            <div class="item" :class="{ 'setting-highlight': current === 3 }" ref="se">
              <div class="text">
                <div class="en">SE Volume</div>
                <div class="cn">特效音量</div>
              </div>
              <div class="slider">
                <div
                  v-for="i in 10"
                  :key="'bgm' + i"
                  class="block"
                  :style="{
                    backgroundImage: i <= se ? `url('${volUrl}')` : `url('${vol0Url}')`
                  }"
                ></div>
              </div>
              <div class="percent">{{ _se }}%</div>
            </div>
            <div class="item" :class="{ 'setting-highlight': current === 4 }" ref="back">
              <div class="text">
                <div class="en">Back</div>
                <div class="cn">返回</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    ready: false,
    fullscreen: false,
    current: 0,
    keydown: 0,
    keepRunning: false,
    bgm: 0,
    se: 0,
    top: 79,
    bgUrl: md5Url('img/vue/setting/select.png'),
    volUrl: md5Url('img/vue/setting/vol.png'),
    vol0Url: md5Url('img/vue/setting/vol_0.png')
  }),
  computed: {
    _bgm() {
      return this.bgm * 10
    },
    _se() {
      return this.se * 10
    }
  },
  watch: {
    show() {
      if (this.show) {
        Methods.hidePopup()
        this.init()
      }
    },
    bgm() {
      AudioManager.bgmVolume = this._bgm
      AudioManager.bgsVolume = this._bgm
      Video.setVolume(Math.min(1, (this.bgm + 2) / 10))
    },
    se() {
      AudioManager.seVolume = this._se
      AudioManager.meVolume = this._se
      if (this.show && this.ready) {
        // SoundManager.playCursor()
        AudioManager.playSe({
          name: 'select',
          pan: 0,
          pitch: 100,
          volume: 90
        })
      }
    },
    current() {
      this.setArrow()
    }
  },
  methods: {
    init() {
      this.keepRunning = ConfigManager.alwaysDash
      this.bgm = AudioManager.bgmVolume / 10
      this.se = AudioManager.seVolume / 10
      this.fullscreen = ConfigManager.fullscreen
      this.setArrow()
    },
    setArrow() {
      this.$nextTick(() => {
        let top = this.top
        if (this.current === 0) {
          top = this.$refs?.fullscreen?.offsetTop
        } else if (this.current === 1) {
          top = this.$refs?.run?.offsetTop
        } else if (this.current === 2) {
          top = this.$refs?.bgm?.offsetTop
        } else if (this.current === 3) {
          top = this.$refs?.se?.offsetTop
        } else if (this.current === 4) {
          top = this.$refs?.back?.offsetTop
        }
        this.top = top
      })
    },
    checkInput(buttonName) {
      if (!this.show) return
      if (!this.ready) this.ready = true
      switch (buttonName) {
        case 'left':
          if (this.current === 0) {
            this.changeFullscreen()
          } else if (this.current === 1) {
            this.changeKeepRunning()
          } else if (this.current === 2) {
            this.bgmDown()
          } else if (this.current === 3) {
            this.seDown()
          }
          break
        case 'right':
          if (this.current === 0) {
            this.changeFullscreen()
          } else if (this.current === 1) {
            this.changeKeepRunning()
          } else if (this.current === 2) {
            this.bgmUp()
          } else if (this.current === 3) {
            this.seUp()
          }
          break
        case 'up':
          if (this.timer) return
          if (this.current === 0) {
            this.current = 4
          } else {
            --this.current
          }
          SoundManager.playCursor()
          this.timer = setTimeout(() => {
            this.timer = null
          }, 100)
          break
        case 'down':
          if (this.timer) return
          if (this.current === 4) {
            this.current = 0
          } else {
            ++this.current
          }
          SoundManager.playCursor()
          this.timer = setTimeout(() => {
            this.timer = null
          }, 100)
          break
        case 'ok':
          this.onKeydown()
          break
        case 'escape':
          this.back()
          break
      }
    },
    onKeydown() {
      switch (this.current) {
        case 0:
          SoundManager.playOk()
          this.changeFullscreen()
          break
        case 1:
          SoundManager.playOk()
          this.changeKeepRunning()
          break
        case 2:
          if (this.bgm === 10) {
            this.bgm = 0
          } else {
            ++this.bgm
          }
          break
        case 3:
          if (this.se === 10) {
            this.se = 0
          } else {
            ++this.se
          }
          break
        case 4:
          this.back()
          break
      }
    },
    changeKeepRunning() {
      this.keepRunning = !this.keepRunning
      ConfigManager.alwaysDash = this.keepRunning
    },
    setBgm(vol) {
      this.bgm = vol
    },
    bgmUp() {
      if (this.bgm === 10) return
      ++this.bgm
    },
    bgmDown() {
      if (this.bgm === 0) return
      --this.bgm
    },
    setSe(vol) {
      this.se = vol
    },
    seUp() {
      if (this.se === 10) return
      ++this.se
    },
    seDown() {
      if (this.se === 0) return
      --this.se
    },
    back() {
      if (!this.show) return
      SoundManager.playCancel()
      ConfigManager.save()
      this.current = 0
      this.show = false
      this.ready = false
      this.$emit('back')
    },
    changeFullscreen() {
      this.fullscreen = electron.ipcRenderer.sendSync('app:fullscreen')
      ConfigManager.fullscreen = this.fullscreen
      Patch.changeFullscreen(this.fullscreen)
    }
  },
  crated() {
    this.timer = null
  }
}
</script>

<style scoped lang="stylus">
.setting-wrapper
  position absolute
  inset 0

  .setting-frame
    overflow hidden
    display flex
    flex-direction column
    color #fff
    position absolute
    width 80%
    height 80%
    left 10%
    top 10%
    background rgba(40, 40, 40, 0.7)
    border 3px solid rgba(255, 176, 170, 0.9)
    border-radius 15px

    .arrow
      position absolute
      left 25px
      height 45px
      width 45px
      transition top 0.1s
      background-size cover
      animation select 0.5s infinite step-start alternate

    .setting-title
      position absolute
      right -30px
      bottom 20px
      transform rotate(330deg)
      background rgba(0, 0, 0, 0.5)
      padding 10px 30px 10px 80px
      font-size 24px

    .setting
      flex 1
      display flex
      flex-direction column
      justify-content space-evenly
      padding-left 10px

      .item
        display flex
        align-items center
        height 45px
        margin-left 85px
        transition color 0.1s

        .text
          width 230px
          display flex
          flex-direction column
          justify-content center

          .cn
            font-size 22px
            line-height 22px

          .en
            font-size 20px
            line-height 22px

        .switch
          overflow hidden
          position relative
          left -5px
          font-size 60px
          width 45px
          height 45px
          padding 2px

          div
            position absolute
            inset 0
            display flex
            align-items center
            justify-content center

        $slider-width = 380px

        .slider
          height 100%
          width $slider-width
          padding 0 4px
          display flex
          align-items center

          .block
            box-sizing border-box
            margin 1px
            width 10%
            height ($slider-width / 10 - @margin * 2)
            border 2px solid transparent
            border-radius 50%
            background-size cover
            background-position center
            background-repeat no-repeat
            transition border-color 0.1s

        .percent
          font-size 25px
          text-align right
          width 60px

.setting-highlight
  color pink

  .block
    border-color pink !important

.fade-enter-active
  transition opacity 0.5s
  transition-delay 0.2s

.fade-leave-active
  transition opacity 0.5s

.fade-enter, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave
  opacity 1

.switch-enter-active, .switch-leave-active
  transition all 0.3s

.switch-enter
  transform translateX(-100%)

.switch-leave-to
  transform translateX(100%)

.switch-enter-to, .switch-leave
  transform translateX(0)

@keyframes select
  0%
    background-position-x 0

  50%
    background-position-x -100%

  100%
    background-position-x 0
</style>
