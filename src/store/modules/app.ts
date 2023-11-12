import { defineStore } from 'pinia'
import { store } from '../index'

interface AppState {
  title: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      title: import.meta.env.VITE_APP_TITLE
    }
  },
  getters: {
    getTitle(): string {
      return this.title
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
