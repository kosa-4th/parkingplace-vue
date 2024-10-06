import { defineStore } from 'pinia'

export const positionStore = defineStore('positionStore', {
  state: () => ({
    myPositionMarker: null,
    searchResultMarker: null,
    searchResultName: null
  }),
  actions: {
    setMyPositionMarker(marker) {
      this.myPositionMarker = marker
    },
    setSearchResultMarker(marker) {
      this.searchResultMarker = marker
    },
    setSearchResultName(overlay) {
      this.searchResultName = overlay
    }
  },
  getters: {}
})
