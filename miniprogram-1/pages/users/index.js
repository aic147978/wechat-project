const { getUsers, getFarms } = require('../../utils/storage')

Page({
  data: { users: [] },
  onShow() {
    const farmMap = getFarms().reduce((m, item) => ({ ...m, [item.id]: item.name }), {})
    const users = getUsers().map((item) => ({ ...item, farmNames: item.farmIds.map((id) => farmMap[id] || id).join('、') }))
    this.setData({ users })
  },
  onAdd() { wx.navigateTo({ url: '/pages/user-form/index' }) },
  onEdit(e) { wx.navigateTo({ url: `/pages/user-form/index?id=${e.currentTarget.dataset.id}` }) }
})
