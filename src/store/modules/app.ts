import { defineStore } from 'pinia'
import { store } from '../index'

interface AppState {
  title: string
  collapse: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      title: import.meta.env.VITE_APP_TITLE,
      collapse: true // 折叠菜单
    }
  },
  getters: {
    getTitle(): string {
      return this.title
    },
    getCollapse(): boolean {
      return this.collapse
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
