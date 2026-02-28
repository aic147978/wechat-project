const { ensureBootstrap } = require('./utils/storage')

App({
  onLaunch() {
    // 启动时初始化 mock 数据，确保离线环境可完整运行。
    ensureBootstrap()
  }
})
