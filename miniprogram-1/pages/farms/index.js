const { getFarms } = require('../../utils/storage')

Page({
  data: { farms: [] },
  onShow() { this.setData({ farms: getFarms() }) },
  onAdd() { wx.navigateTo({ url: '/pages/farm-form/index' }) },
  onEdit(e) { wx.navigateTo({ url: `/pages/farm-form/index?id=${e.currentTarget.dataset.id}` }) }
})
