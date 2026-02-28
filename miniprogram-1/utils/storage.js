const { defaultFarms, defaultUsers, defaultSessions, storageKeys } = require('./mockData')

const clone = (data) => JSON.parse(JSON.stringify(data))

const ensureBootstrap = () => {
  if (!wx.getStorageSync(storageKeys.farms)) {
    wx.setStorageSync(storageKeys.farms, clone(defaultFarms))
  }
  if (!wx.getStorageSync(storageKeys.users)) {
    wx.setStorageSync(storageKeys.users, clone(defaultUsers))
  }
  if (!wx.getStorageSync(storageKeys.sessions)) {
    wx.setStorageSync(storageKeys.sessions, clone(defaultSessions))
  }
}

const getFarms = () => wx.getStorageSync(storageKeys.farms) || []
const saveFarms = (farms) => wx.setStorageSync(storageKeys.farms, farms)

const getUsers = () => wx.getStorageSync(storageKeys.users) || []
const saveUsers = (users) => wx.setStorageSync(storageKeys.users, users)

const getSessions = () => wx.getStorageSync(storageKeys.sessions) || []
const saveSessions = (sessions) => wx.setStorageSync(storageKeys.sessions, sessions)

const appendSession = (session) => {
  const sessions = getSessions()
  sessions.unshift(session)
  saveSessions(sessions)
}

const setLogin = (token, userProfile) => {
  wx.setStorageSync(storageKeys.token, token)
  wx.setStorageSync(storageKeys.userProfile, userProfile)
}

const getLoginInfo = () => ({
  token: wx.getStorageSync(storageKeys.token) || '',
  userProfile: wx.getStorageSync(storageKeys.userProfile) || null
})

const clearLogin = () => {
  wx.removeStorageSync(storageKeys.token)
  wx.removeStorageSync(storageKeys.userProfile)
}

const genId = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

module.exports = {
  ensureBootstrap,
  getFarms,
  saveFarms,
  getUsers,
  saveUsers,
  getSessions,
  saveSessions,
  appendSession,
  setLogin,
  getLoginInfo,
  clearLogin,
  genId,
  storageKeys
}
