const { getLoginInfo, clearLogin, getFarms, getUsers } = require('../../utils/storage')

Page({
  data: {
    userProfile: null,
    farmCount: 0,
    userCount: 0
  },
  onShow() {
    const { token, userProfile } = getLoginInfo()
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' })
      return
    }
    this.setData({
      userProfile,
      farmCount: getFarms().length,
      userCount: getUsers().length
    })
  },
  goFarms() { wx.navigateTo({ url: '/pages/farms/index' }) },
  goUsers() { wx.navigateTo({ url: '/pages/users/index' }) },
  goOffline() { wx.navigateTo({ url: '/pages/offline/index' }) },
  onLogout() {
    clearLogin()
    wx.redirectTo({ url: '/pages/login/index' })
  }
})
