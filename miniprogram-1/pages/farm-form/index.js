const { getFarms, saveFarms, genId } = require('../../utils/storage')

Page({
  data: { id: '', name: '' },
  onLoad(query) {
    if (!query.id) return
    const target = getFarms().find((item) => item.id === query.id)
    if (target) this.setData({ id: target.id, name: target.name })
  },
  onInput(e) { this.setData({ name: e.detail.value }) },
  onSave() {
    if (!this.data.name.trim()) {
      wx.showToast({ title: '请输入养殖场名称', icon: 'none' })
      return
    }
    const farms = getFarms()
    if (this.data.id) {
      const next = farms.map((item) => (item.id === this.data.id ? { ...item, name: this.data.name } : item))
      saveFarms(next)
    } else {
      farms.push({ id: genId('farm'), name: this.data.name })
      saveFarms(farms)
    }
    wx.navigateBack()
  }
})
