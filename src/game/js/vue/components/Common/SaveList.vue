<template>
  <div>
    <transition name="fade">
      <div v-if="isShow" class="save-list-wrapper">
        <div class="save-list">
          <div
            v-for="(item, key) in list"
            :key="`save-${key}`"
            class="save-item"
            :class="{ 'save-highlight': index === key, 'auto-save': key === 0 }"
          >
            <div class="chapter" v-if="item.chapters === 0 || item.chapters">
              Chapter {{ item.chapters }}
            </div>
            <div v-if="item.ready" style="width: 250px">
              <div class="auto-save-tip" v-if="key === 0">AutoSave</div>
              <div>Play Time: {{ item.playtime }}</div>
              <div>Save Time: {{ item.savetime }}</div>
            </div>
            <div v-else class="no-data">No Data</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
module.exports = {
  data: () => ({
    isShow: false,
    index: 0,
    type: 0,
    confirm: false,
    list: [{}, {}, {}, {}, {}, {}]
  }),
  methods: {
    // 0-load 1-save
    show(type, confirm) {
      for (let i = 0; i <= 4; i++) {
        this.getSaveData(i)
      }

      this.type = type
      this.confirm = confirm

      if (type === 0) {
        let temp = 0
        let id = 0
        this.list.forEach((item, index) => {
          if (item.ready) {
            ++temp
            id = index
          }
        })
        if (temp === 1) {
          if (confirm) {
            Methods.showChoice(
              'Do you wish to load this save file',
              '是否读取存档',
              () => {
                this.$emit('load', this.index)
              },
              () => {
                this.$emit('back')
              }
            )
          } else {
            this.$emit('back', true)
            this.$emit('load', id)
          }
        } else {
          const lastSaveId = DataManager.latestSavefileId()
          this.index = lastSaveId < 0 ? 0 : lastSaveId
          this.isShow = true
        }
      } else {
        const lastSaveId = DataManager.latestSavefileId()
        this.index = lastSaveId < 0 ? 0 : lastSaveId
        this.isShow = true
      }
    },
    checkInput(buttonName) {
      if (!this.isShow) return
      switch (buttonName) {
        case 'left':
          this.up()
          break
        case 'right':
          this.down()
          break
        case 'up':
          this.up()
          break
        case 'down':
          this.down()
          break
        case 'ok':
          this.onKeydown()
          break
        case 'escape':
          this.back()
          break
      }
    },
    up() {
      if (this.index === 0) {
        this.index = 4
      } else {
        --this.index
      }
      if (this.type === 0) {
        if (!this.list[this.index].ready) {
          this.up()
        }
        return
      }
      if (this.type === 1) {
        if (this.index === 0) {
          this.up()
        }
        return
      }
    },
    down() {
      if (this.index === 4) {
        this.index = 0
      } else {
        ++this.index
      }
      if (this.type === 0) {
        if (!this.list[this.index].ready) {
          this.down()
        }
        return
      }
      if (this.type === 1) {
        if (this.index === 0) {
          this.down()
        }
        return
      }
    },
    onKeydown() {
      if (this.type === 0) {
        if (this.confirm) {
          Methods.showChoice('Do you wish to load this save file', '是否读取存档', () => {
            this.isShow = false
            this.$emit('load', this.index)
          })
        } else {
          this.isShow = false
          this.$emit('load', this.index)
        }
      } else {
        if (this.list[this.index].ready) {
          Methods.showChoice('Do you wish to overwrite this save file', '是否覆盖存档', () => {
            this.isShow = false
            this.$emit('save', this.index)
          })
        } else {
          this.isShow = false
          this.$emit('save', this.index)
        }
      }
    },
    back() {
      this.isShow = false
      this.$emit('back')
    },
    getSaveData(id) {
      if (DataManager.savefileExists(id)) {
        this.$set(
          this.list[id],
          'chapters',
          Methods.getChapter(DataManager._globalInfo?.[id]?.chapters)
        )
        this.$set(this.list[id], 'playtime', DataManager._globalInfo?.[id]?.playtime || 'Unknown')
        this.$set(
          this.list[id],
          'savetime',
          DataManager._globalInfo?.[id]?.timestamp
            ? new Date(DataManager._globalInfo?.[id]?.timestamp).toLocaleString()
            : 'Unknown'
        )
        this.$set(this.list[id], 'ready', true)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.save-list-wrapper
  position absolute
  inset 0
  display flex
  align-items center
  justify-content center

  .save-list
    overflow hidden
    display flex
    flex-direction column
    color #fff
    width 60%
    height 80%
    background rgba(40, 40, 40, 0.7)
    border 3px solid rgba(255, 176, 170, 0.9)
    border-radius 15px
    gap 5px
    padding 5px
    backdrop-filter blur(5px)

    .save-item
      position relative
      display flex
      justify-content center
      align-items center
      font-size 16px
      border 1px solid
      border-radius 5px
      height 20%

      .auto-save-tip
        position absolute
        left 5px
        top -5px
        font-size 10px

      .chapter
        position absolute
        right 0px
        bottom 0px
        font-size 12px
        line-height 20px
        width 70px

      .no-data
        font-size 26px

.save-highlight
  animation save-highlight-fade 0.5s alternate infinite

.auto-save
  border-color pink !important
  border-width 1.5px !important
  box-sizing border-box

@keyframes save-highlight-fade
  from
    background rgba(255, 176, 170, 0.7)

  to
    background rgba(255, 176, 170, 0.9)
</style>
