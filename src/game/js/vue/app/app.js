VueMain.app = new Vue({
  el: '#app',
  template: VueMain.loadTemplate('app'),
  components: {
    TitleBar: VueMain.loadComponent('Window/TitleBar'),
    Window: VueMain.loadComponent('Main'),
    Logo: VueMain.loadComponent('View/Logo'),
    Loading: VueMain.loadComponent('View/Loading'),
    Credits: VueMain.loadComponent('View/Credits'),
    MainMenu: VueMain.loadComponent('Menu/MainMenu'),
    GameMenu: VueMain.loadComponent('Menu/GameMenu'),
    MoveTip: VueMain.loadComponent('Popup/MoveTip'),
    Tip: VueMain.loadComponent('Popup/Tip'),
    Popup: VueMain.loadComponent('Popup/Popup'),
    Choice: VueMain.loadComponent('Popup/Choice'),
    Message: VueMain.loadComponent('Message/Message'),
    Log: VueMain.loadComponent('Message/Log'),
    Debug: VueMain.loadComponent('Temp/Debug')
  },
  data: () => ({
    ready: false,
    main: {
      scale: 1,
      width: 1024,
      height: 720,
      top: 30,
    }
  }),
  methods: {
    setReady() {
      this.ready = true
      Components.Logo.start()
    }
  },
  mounted() {
    this.$nextTick(() => {
      electron.ipcRenderer.send('vue:ready', (test || dev))
    })
  },
  errorCaptured(_err, vm, info) {
    console.error(`[${info}]:` ,vm)
  }
})

VueMain._current = ['Logo']