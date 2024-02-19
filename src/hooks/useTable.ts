export interface Pageable {
  current: number
  size: number
  total: number
}

export interface StateProps {
  loading: boolean
  tableData: any[]
  pageable: Pageable
  searchParam: {
    [key: string]: any
  }
  searchInitParam: {
    [key: string]: any
  }
  totalParam: {
    [key: string]: any
  }
  icon?: {
    [key: string]: any
  }
}

export const useTable = (
  api?: (params: any) => Promise<any>,
  initParam: object = {},
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void
) => {
  const state = reactive<StateProps>({
    loading: false,
    tableData: [],
    pageable: {
      current: 1,
      size: 10,
      total: 0
    },
    searchParam: {},
    searchInitParam: {},
    totalParam: {}
  })

  /**
   * 分页查询参数
   */
  const pageParam = computed({
    get: () => {
      return {
        current: state.pageable.current,
        size: state.pageable.size
      }
    },
    set: (newVal: any) => {
      console.log('我是分页更新之后的值', newVal)
    }
  })

  /**
   * 获取表格数据
   */
  const getTableList = async () => {
    if (!api) {
      return
    }
    state.loading = true
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, pageParam.value)
      let data = await api({ ...state.searchInitParam, ...state.totalParam })
      dataCallBack && (data = dataCallBack(data))
      state.tableData = data.records
      // 解构后台返回的分页数据
      const { current, size, total } = data
      updatePageable({ current, size, total })
    } catch (error) {
      requestError && requestError(error)
    } finally {
      state.loading = false
    }
  }

  /**
   * 更新查询参数
   */
  const updatedTotalParam = () => {
    state.totalParam = {}
    // 处理查询参数，可以给查询参数加自定义前缀操作
    const nowSearchParam: StateProps['searchParam'] = {}
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (const key in state.searchParam) {
      // 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParam, pageParam.value)
  }

  /**
   * 更新分页信息
   */
  const updatePageable = (pageable: Pageable) => {
    Object.assign(state.pageable, pageable)
  }

  /**
   * 表格数据查询
   */
  const search = () => {
    state.pageable.current = 1
    updatedTotalParam()
    getTableList()
  }

  /**
   * 表格数据重置
   */
  const reset = () => {
    state.pageable.current = 1
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam }
    updatedTotalParam()
    getTableList()
  }

  /**
   * 每页条数改变
   */
  const handleSizeChange = (val: number) => {
    state.pageable.current = 1
    state.pageable.size = val
    getTableList()
  }

  /**
   * 当前页改变
   */
  const handleCurrentChange = (val: number) => {
    state.pageable.current = val
    getTableList()
  }

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    updatedTotalParam
  }
}
