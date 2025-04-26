<template>
  <div id="choice">
    <transition name="fade">
      <div class="choice" v-if="show">
        <div class="en">{{ en }}</div>
        <div class="cn">{{ cn }}</div>
        <div class="key-list">
          <div class="key" :class="{ highlight: current }">Yes</div>
          <div class="key" :class="{ highlight: !current }">No</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    show: false,
    current: true,
    en: '',
    cn: '',
    fn: () => {},
    cb: () => {}
  }),
  methods: {
    showChoice(en, cn, fn, cb) {
      if ((en || cn) && fn) {
        this.en = en
        this.cn = cn
        this.fn = fn
        if (cb) this.cb = cb
        this.show = true
        Methods.hidePopup()
      } else {
        console.warn('Choice: 参数错误')
      }
    },
    hideChoice() {
      this.show = false
    },
    checkInput(buttonName) {
      if (this.show) {
        switch (buttonName) {
          case 'left':
            this.changeChoice()
            break
          case 'right':
            this.changeChoice()
            break
          case 'up':
            this.changeChoice()
            break
          case 'down':
            this.changeChoice()
            break
          case 'ok':
            this.choiceKeyDown()
            break
        }
      }
    },
    changeChoice() {
      SoundManager.playCursor()
      this.current = !this.current
    },
    choiceKeyDown() {
      if (this.current) {
        this.cb()
        this.fn()
        this.reset()
      } else {
        SoundManager.playCancel()
        this.cb()
        this.reset()
      }
    },
    reset() {
      this.cn = ''
      this.en = ''
      this.fn = () => {}
      this.cb = () => {}
      this.show = false
      this.current = true
    }
  }
}
</script>

<style lang="stylus" scoped>
$pink = rgba(255, 176, 170, 0.9)

.choice
  z-index 901
  color #fff
  position absolute
  left 50%
  top 50%
  background rgba(0, 0, 0, 0.7)
  transform translate(-50%, -50%)
  padding 10px
  text-align center
  border 2px solid $pink
  border-radius 10px
  padding 15px 10px
  backdrop-filter blur(2px)

  .en
    font-size 16px
    line-height 16px
    white-space pre

  .cn
    font-size 20px
    line-height 20px
    margin-top 5px

  .key-list
    display flex
    align-items center
    justify-content space-around
    margin-top 20px
    width 100%

    .key
      min-width 40px
      padding 8px 10px
      font-size 14px
      line-height 14px
      border 2px solid transparent
      border-radius 10px
      transition border 0.2s

.highlight
  border-color rgba(255, 176, 170, 0.9) !important
</style>
