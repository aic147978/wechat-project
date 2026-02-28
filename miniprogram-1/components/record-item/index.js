Component({
  properties: {
    record: { type: Object, value: {} },
    unit: { type: String, value: 'g' },
    index: { type: Number, value: 0 }
  },
  methods: {
    onMore() {
      this.triggerEvent('more', { id: this.data.record.id })
    }
  }
})
