export interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid'
}

export const findPath = <T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T | T[] | null => {
  config = getConfig(config)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

export const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config)

/**
 * 过滤树，获取指定层级的树
 * @param tree 树
 * @param maxDepth 最大深度
 * @returns 过滤后的树
 */
export const filterTree = (tree: any[], maxDepth: number): any[] => {
  return tree.map((node) => {
    if (node.children && node.children.length > 0 && maxDepth > 1) {
      return {
        ...node,
        children: filterTree(node.children, maxDepth - 1)
      }
    } else {
      return { ...node, children: [] }
    }
  })
}
