<template>
  <div id="log">
    <transition name="slide-down" @after-leave="logHide">
      <div class="log-wrapper" ref="log" v-if="isShow">
        <template v-for="(item, index) in list">
          <div class="item" :key="index">
            <div class="name">
              {{ item.name }}
            </div>
            <div class="en" v-html="item.en"></div>
            <div class="cn" v-html="item.cn"></div>
          </div>
        </template>
        <div class="empty" v-if="list.length < 1">
          <div class="en">Nothing</div>
          <div class="cn">什么都没有哦</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    isShow: false,
    isHide: true,
    noShow: false,
    message: false,
    choice: false,
    list: []
  }),
  methods: {
    add(name, en, cn) {
      this.list.push({
        name,
        en,
        cn
      })
      if (this.list.length > 50) {
        this.list.shift()
      }
    },
    async show() {
      Methods.hideTip()
      this.isHide = false
      Patch.startWait()
      this.isShow = true
      await this.$nextTick()
      this.$refs.log.scrollTop = this.$refs.log.scrollHeight
    },
    hide() {
      this.isShow = false
      if (this.message) {
        if (Components.Message?.message) {
          Components.Message.message.show = true
        }
        this.message = false
      }
      if (this.choice) {
        if (Components.Message?.message) {
          Components.Message.message.show = true
        }
        this.choice = false
      }
      Patch.stopWait()
    },
    up() {
      if (this.logAnime) return
      this.logAnime = anime({
        targets: this.$refs.log,
        scrollTop: this.$refs.log.scrollTop - 150,
        easing: 'linear',
        duration: 200
      })
      this.logAnime.finished.then(() => {
        this.logAnime = null
      })
    },
    down() {
      if (this.logAnime) return
      this.logAnime = anime({
        targets: this.$refs.log,
        scrollTop: this.$refs.log.scrollTop + 150,
        easing: 'linear',
        duration: 200
      })
      this.logAnime.finished.then(() => {
        this.logAnime = null
      })
    },
    checkInput(buttonName) {
      if (SceneManager._scene?.constructor?.name !== 'Scene_Map') return
      if (this.isShow) {
        switch (buttonName) {
          case 'escape':
            this.hide()
            break
          case 'tab':
            this.hide()
            break
          case 'up':
            this.up()
            break
          case 'down':
            this.down()
            break
          case 'left':
            this.up()
            break
          case 'right':
            this.down()
            break
        }
      } else {
        if (buttonName === 'tab') {
          if (
            $gamePlayer.isMoving() ||
            SceneManager.isSceneChanging() ||
            this.noShow ||
            Components.Message?.hide.flag
          )
            return
          if (Components.Message?.message.show) {
            Components.Message.message.show = false
            this.message = true
          }
          if (Components.Message?.choice.show) {
            Components.Message.choice.show = false
            this.choice = true
          }
          this.show()
        }
      }
    },
    logHide() {
      this.isHide = true
    }
  },
  created() {
    this.logAnime = null
  }
}
</script>

<style scoped lang="stylus">
$pink = rgba(255, 176, 170, 0.9)

#log
  color #fff
  text-shadow -1px -1px 0 #4f4d57, 1px -1px 0 #4f4d57, -1px 1px 0 #4f4d57, 1px 1px 0 #4f4d57, 0px 2px 2px rgba(0, 0, 0, 0.6)

  .log-wrapper
    position absolute
    top 0
    left 0
    right 0
    overflow hidden
    max-height 95%
    background rgba(40, 40, 40, 0.7)
    border 2px solid $pink
    border-top none
    border-bottom-left-radius 10px
    border-bottom-right-radius 10px
    margin 0 5px
    padding 5px 10px 15px 10px

    .item
      margin 5px 0
      padding 5px

      .name
        font-weight bold
        font-size 20px
        line-height 26px

      .en
        font-size 18px
        line-height 18px

      .cn
        font-size 20px
        line-height 26px

  .empty
    padding 10px
    text-align center

    .en
      font-size 18px
      line-height 18px

    .cn
      font-size 20px
      line-height 26px

.slide-down-enter-active, .slide-down-leave-active
  transition all 0.3s

.slide-down-enter-to, .slide-down-leave
  transform translateY(0)
  opacity 1

.slide-down-enter, .slide-down-leave-to
  transform translateY(-100%)
  opacity 0
</style>
