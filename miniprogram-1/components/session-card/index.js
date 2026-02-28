Component({
  properties: {
    session: { type: Object, value: {} },
    farmName: { type: String, value: '-' }
  },
  methods: {
    onTapCard() {
      this.triggerEvent('tapcard', { id: this.data.session.id })
    }
  }
})
