const defaultFarms = [
  { id: 'farm-1', name: '江南示范养殖场' },
  { id: 'farm-2', name: '北山生态鸡场' },
  { id: 'farm-3', name: '清源青年养殖合作社' }
]

const defaultUsers = [
  { id: 'user-1', name: '管理员', role: 'admin', farmIds: ['farm-1', 'farm-2'] },
  { id: 'user-2', name: '李师傅', role: 'operator', farmIds: ['farm-1'] },
  { id: 'user-3', name: '王场长', role: 'manager', farmIds: ['farm-2', 'farm-3'] }
]

const defaultSessions = [
  {
    id: 'session-demo-1',
    deviceId: 'BLE-10001',
    farmId: 'farm-1',
    unit: 'g',
    batchNo: 'BATCH-20260101-01',
    gradeMode: 'smart',
    createdBy: 'user-2',
    createdByName: '李师傅',
    startAt: 1760000000000,
    endAt: 1760000900000,
    records: [
      { id: 'r-1', weight: 980, status: 'normal', note: '', ts: 1760000100000 },
      { id: 'r-2', weight: 1230, status: 'normal', note: '', ts: 1760000200000 },
      { id: 'r-3', weight: 860, status: 'discard', note: '状态不佳', ts: 1760000300000 }
    ]
  }
]

const storageKeys = {
  farms: 'smartScaleFarms',
  users: 'smartScaleUsers',
  sessions: 'smartScaleSessions',
  token: 'smartScaleToken',
  userProfile: 'smartScaleUserProfile'
}

module.exports = {
  defaultFarms,
  defaultUsers,
  defaultSessions,
  storageKeys
}
