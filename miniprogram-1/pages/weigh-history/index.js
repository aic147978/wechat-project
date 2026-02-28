const { getSessions, getFarms } = require('../../utils/storage')

const fmt = (ts) => {
  const d = new Date(ts)
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

Page({
  data: {
    keyword: '',
    list: [],
    raw: []
  },
  onShow() {
    const farms = getFarms()
    const farmMap = farms.reduce((map, item) => {
      map[item.id] = item.name
      return map
    }, {})
    const raw = getSessions().map((item) => ({
      ...item,
      farmName: farmMap[item.farmId] || '未知养殖场',
      endAtText: `${fmt(item.endAt)} ${item.createdByName}`
    }))
    this.setData({ raw, list: raw })
  },
  onInput(e) {
    const keyword = e.detail.value.trim()
    const k = keyword.toLowerCase()
    const list = this.data.raw.filter((item) => {
      const date = fmt(item.endAt)
      return item.deviceId.toLowerCase().includes(k) || date.includes(k) || (item.createdByName || '').toLowerCase().includes(k)
    })
    this.setData({ keyword, list })
  },
  onOpen(e) {
    wx.navigateTo({ url: `/pages/weigh-detail/index?id=${e.detail.id}` })
  }
})
