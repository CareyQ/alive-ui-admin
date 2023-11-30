declare module 'vue' {
  export interface GlobalComponents {
    Icon: (typeof import('@/components/Icon'))['Icon']
    Tag: (typeof import('@/components/Tag'))['Tag']
  }
}

export {}
