const { getUsers } = require('../../utils/storage')
const { setLogin, getLoginInfo } = require('../../utils/storage')

Page({
  data: {
    phone: '',
    code: ''
  },
  onShow() {
    const { token } = getLoginInfo()
    if (token) {
      wx.switchTab({ url: '/pages/weigh/index' })
    }
  },
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },
  onCodeInput(e) {
    this.setData({ code: e.detail.value })
  },
  onLogin() {
    const { phone, code } = this.data
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入11位手机号', icon: 'none' })
      return
    }
    if (code !== '123456') {
      wx.showToast({ title: '验证码错误，请输入123456', icon: 'none' })
      return
    }
    const users = getUsers()
    const target = users[0] || { id: 'guest', name: '游客', role: 'viewer', farmIds: [] }
    const profile = { ...target, phone }
    setLogin(`mock-token-${Date.now()}`, profile)
    wx.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/weigh/index' })
    }, 350)
  }
})
