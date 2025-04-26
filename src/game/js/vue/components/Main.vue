<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px', top: top + 'px' }">
    <div
      class="wrapper"
      :style="{
        width: wrapper.width + 'px',
        height: wrapper.height + 'px',
        transform: `scale(${scale})`
      }"
    >
      <slot></slot>
      <transition name="fade">
        <div class="save" v-if="save.show">
          <svg viewBox="0 0 1024 1024" version="1.1" width="30" height="30">
            <path
              d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z"
              fill="#FFB0AA"
            ></path>
          </svg>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    scale: Number,
    width: Number,
    height: Number,
    top: Number
  },
  data: () => ({
    save: {
      show: false
    },
    wrapper: {
      width: 1024,
      height: 720
    }
  }),
  methods: {
    setup(width, height) {
      if (width && height) {
        this.wrapper.width = width
        this.wrapper.height = height
      }
      this.$nextTick(() => {
        this.$emit('ready')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#main
  overflow hidden
  position absolute
  inset 0px
  top 30px
  z-index 90
  font-size 30px
  line-height 30px
  margin auto

  .wrapper
    transform-origin left top

    .save
      z-index 999
      position absolute
      top 10px
      right 7px
      width 30px
      height 30px
      animation 1.5s linear 0s infinite normal none running spin

@keyframes spin
  from
    transform rotate(0deg)

  to
    transform rotate(360deg)
</style>

<style lang="stylus">
.fade-enter, .fade-leave-to
  opacity 0 !important

.fade-enter-to, .fade-leave
  opacity 1 !important

.fade-enter-active, .fade-leave-active
  transition opacity 0.25s linear !important

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>