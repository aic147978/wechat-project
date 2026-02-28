const {
  getLoginInfo,
  getFarms,
  getSessions,
  appendSession,
  genId
} = require('../../utils/storage')

const connectionLabels = {
  idle: '未连接',
  connecting: '连接中',
  connected: '已连接'
}

const gradeModes = ['normal', 'smart', 'manual']

const formatTime = (ts) => {
  const d = new Date(ts)
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const formatDateTime = (ts) => {
  const d = new Date(ts)
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

Page({
  data: {
    deviceId: '',
    connectionStatus: 'idle',
    connectionLabel: connectionLabels.idle,
    batchNo: '',
    farmIndex: 0,
    farms: [],
    currentFarmName: '请先创建养殖场',
    units: ['g', '斤'],
    unitIndex: 0,
    gradeMode: 'normal',
    records: [],
    recentSessions: []
  },
  onShow() {
    const { token } = getLoginInfo()
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' })
      return
    }
    const farms = getFarms()
    const sessions = this.decorateSessions(getSessions())
    this.setData({
      farms,
      currentFarmName: farms[0] ? farms[0].name : '请先创建养殖场',
      recentSessions: sessions.slice(0, 5),
      batchNo: this.data.batchNo || `BATCH-${Date.now()}`
    })
  },
  decorateSessions(sessions) {
    const farms = getFarms()
    const farmMap = farms.reduce((map, item) => {
      map[item.id] = item.name
      return map
    }, {})
    return sessions.map((item) => ({
      ...item,
      endAtText: formatDateTime(item.endAt),
      farmName: farmMap[item.farmId] || '未知养殖场'
    }))
  },
  onScan() {
    wx.scanCode({
      success: (res) => {
        this.setData({ deviceId: res.result || `BLE-${Date.now().toString().slice(-5)}` })
      },
      fail: () => {
        this.setData({ deviceId: `MOCK-BLE-${Date.now().toString().slice(-4)}` })
        wx.showToast({ title: '未扫码，已使用模拟设备', icon: 'none' })
      }
    })
  },
  onConnect() {
    if (!this.data.deviceId) {
      wx.showToast({ title: '请先扫码获取设备号', icon: 'none' })
      return
    }
    this.setData({ connectionStatus: 'connecting', connectionLabel: connectionLabels.connecting })
    setTimeout(() => {
      this.setData({ connectionStatus: 'connected', connectionLabel: connectionLabels.connected })
      wx.showToast({ title: '设备已连接', icon: 'success' })
    }, 900)
  },
  onBatchInput(e) {
    this.setData({ batchNo: e.detail.value })
  },
  onFarmChange(e) {
    const farmIndex = Number(e.detail.value)
    const currentFarmName = this.data.farms[farmIndex] ? this.data.farms[farmIndex].name : '请先创建养殖场'
    this.setData({ farmIndex, currentFarmName })
  },
  onUnitChange(e) {
    this.setData({ unitIndex: Number(e.detail.value) })
  },
  onGradeChange(e) {
    const idx = Number(e.detail.value)
    this.setData({ gradeMode: gradeModes[idx] })
  },
  onAddRecord() {
    if (this.data.connectionStatus !== 'connected') {
      wx.showToast({ title: '请先连接设备', icon: 'none' })
      return
    }
    const weight = Math.floor(Math.random() * (2000 - 700 + 1)) + 700
    const ts = Date.now()
    const record = {
      id: genId('record'),
      weight,
      status: 'normal',
      note: '',
      ts,
      timeText: formatTime(ts)
    }
    this.setData({ records: [record, ...this.data.records] })
  },
  onClearRecords() {
    wx.showModal({
      title: '清除确认',
      content: '确定要清空当前称重记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ records: [] })
        }
      }
    })
  },
  onRecordMore(e) {
    const { id } = e.detail
    wx.showActionSheet({
      itemList: ['标记淘汰', '标记删除', '添加说明'],
      success: (res) => {
        const records = this.data.records.map((item) => {
          if (item.id !== id) return item
          if (res.tapIndex === 0) return { ...item, status: 'discard' }
          if (res.tapIndex === 1) return { ...item, status: 'deleted' }
          return { ...item, note: '人工备注：需复检' }
        })
        this.setData({ records })
      }
    })
  },
  onFinish() {
    const { farms, farmIndex, units, unitIndex, records, deviceId, batchNo, gradeMode } = this.data
    if (!records.length) {
      wx.showToast({ title: '请至少新增一条记录', icon: 'none' })
      return
    }
    const { userProfile } = getLoginInfo()
    const session = {
      id: genId('session'),
      deviceId: deviceId || 'MOCK-DEVICE',
      farmId: farms[farmIndex] ? farms[farmIndex].id : '',
      unit: units[unitIndex],
      batchNo,
      gradeMode,
      startAt: records[records.length - 1].ts,
      endAt: records[0].ts,
      createdBy: userProfile ? userProfile.id : 'unknown',
      createdByName: userProfile ? userProfile.name : '未知用户',
      records: records.map(({ id, weight, status, note, ts }) => ({ id, weight, status, note, ts }))
    }
    appendSession(session)
    wx.showToast({ title: '已保存批次', icon: 'success' })
    this.setData({ records: [], deviceId: '', connectionStatus: 'idle', connectionLabel: connectionLabels.idle })
    wx.navigateTo({ url: `/pages/weigh-detail/index?id=${session.id}` })
  },
  onOpenHistory() {
    wx.navigateTo({ url: '/pages/weigh-history/index' })
  },
  onOpenSession(e) {
    wx.navigateTo({ url: `/pages/weigh-detail/index?id=${e.detail.id}` })
  }
})
