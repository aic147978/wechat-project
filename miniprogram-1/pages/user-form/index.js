const { getUsers, saveUsers, getFarms, genId } = require('../../utils/storage')

Page({
  data: {
    id: '',
    name: '',
    role: 'operator',
    roles: ['admin', 'operator', 'manager'],
    farms: [],
    farmIndex: 0,
    currentFarmName: '无'
  },
  onLoad(query) {
    const farms = getFarms()
    this.setData({ farms, currentFarmName: farms[0] ? farms[0].name : '无' })
    if (!query.id) return
    const user = getUsers().find((item) => item.id === query.id)
    if (user) {
      const farmIndex = Math.max(farms.findIndex((item) => item.id === user.farmIds[0]), 0)
      this.setData({
        id: user.id,
        name: user.name,
        role: user.role,
        farmIndex,
        currentFarmName: farms[farmIndex] ? farms[farmIndex].name : '无'
      })
    }
  },
  onNameInput(e) { this.setData({ name: e.detail.value }) },
  onRoleChange(e) { this.setData({ role: this.data.roles[Number(e.detail.value)] }) },
  onFarmChange(e) {
    const farmIndex = Number(e.detail.value)
    this.setData({ farmIndex, currentFarmName: this.data.farms[farmIndex] ? this.data.farms[farmIndex].name : '无' })
  },
  onSave() {
    if (!this.data.name.trim()) {
      wx.showToast({ title: '请输入用户名', icon: 'none' })
      return
    }
    const users = getUsers()
    const payload = {
      id: this.data.id || genId('user'),
      name: this.data.name,
      role: this.data.role,
      farmIds: this.data.farms[this.data.farmIndex] ? [this.data.farms[this.data.farmIndex].id] : []
    }
    const next = this.data.id ? users.map((item) => (item.id === this.data.id ? payload : item)) : [...users, payload]
    saveUsers(next)
    wx.navigateBack()
  }
})
