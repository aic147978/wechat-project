const { getSessions, getFarms } = require('../../utils/storage')

const fmt = (ts) => {
  const d = new Date(ts)
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

Page({
  data: {
    session: null,
    stats: null,
    bars: []
  },
  onLoad(query) {
    this.loadSession(query.id)
  },
  loadSession(id) {
    const sessions = getSessions()
    const farms = getFarms()
    const farmMap = farms.reduce((m, item) => ({ ...m, [item.id]: item.name }), {})
    const session = sessions.find((item) => item.id === id)
    if (!session) {
      wx.showToast({ title: '批次不存在', icon: 'none' })
      return
    }
    const values = session.records.map((r) => r.weight)
    const sum = values.reduce((a, b) => a + b, 0)
    const stats = {
      avg: values.length ? Math.round(sum / values.length) : 0,
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      count: values.length
    }
    const bins = [
      { label: '700-999', min: 700, max: 999 },
      { label: '1000-1299', min: 1000, max: 1299 },
      { label: '1300-1599', min: 1300, max: 1599 },
      { label: '1600-2000', min: 1600, max: 2000 }
    ]
    const maxCount = Math.max(...bins.map((b) => values.filter((w) => w >= b.min && w <= b.max).length), 1)
    const bars = bins.map((bin) => {
      const count = values.filter((w) => w >= bin.min && w <= bin.max).length
      return { ...bin, count, width: `${Math.max((count / maxCount) * 100, 8)}%` }
    })
    this.setData({
      session: {
        ...session,
        farmName: farmMap[session.farmId] || '-',
        startText: fmt(session.startAt),
        endText: fmt(session.endAt)
      },
      stats,
      bars
    })
  },
  onFakeExport() {
    wx.setClipboardData({
      data: `https://mock.scale/sessions/${this.data.session.id}`,
      success: () => wx.showToast({ title: '已复制导出链接', icon: 'none' })
    })
  },
  onFakeShare() {
    wx.showModal({ title: '分享提示', content: '当前为前端演示，已模拟分享成功。', showCancel: false })
  }
})
