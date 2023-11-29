import { RefreshRight, Plus, Search } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import * as RoleApi from '@/api/system/role'
import RoleForm from './RoleForm.vue'
import RoleAssignMenuDrawer from './RoleAssignMenuDrawer.vue'

export default (() => {
  const __VLS_setup = async () => {
    const message = useMessage()

    const tableLoading = ref(false)
    const tableData = ref<any>([])
    const formRef = ref()
    const menuDrawerRef = ref()

    const total = ref(0)
    const queryParams = reactive({
      current: 1,
      size: 10,
      name: ''
    })

    const getRolePage = async () => {
      tableLoading.value = true
      try {
        const data = await RoleApi.getPage(queryParams)
        tableData.value = data.records
        total.value = data.total
      } finally {
        tableLoading.value = false
      }
    }

    const openForm = (id?: number) => {
      formRef.value.open(id)
    }
    const openForm = (id?: number) => {
      formRef.value.open(id)
    }

    const handleDel = async (id: number) => {
      await message.delConfirm()
      await RoleApi.del(id)
      message.success('删除成功')
      await getRolePage()
    }

    const handleDefaultChange = async (id: number, isDefault: boolean) => {
      try {
        await RoleApi.changeDefault(id, isDefault)
        message.success('设置成功')
      } catch (e) {
      } finally {
        await getRolePage()
      }
    }

    onMounted(() => {
      getRolePage()
    })
    const __VLS_publicComponent = (await import('vue')).defineComponent({
      setup() {
        return {}
      }
    })

    const __VLS_componentsOption = {}

    let __VLS_name!: 'index'
    function __VLS_template() {
      let __VLS_ctx!: InstanceType<
        import('./__VLS_types.js').PickNotAny<
          typeof __VLS_publicComponent,
          new () => {}
        >
      > &
        InstanceType<
          import('./__VLS_types.js').PickNotAny<
            typeof __VLS_internalComponent,
            new () => {}
          >
        > & {}
      /* Components */
      let __VLS_localComponents!: NonNullable<
        typeof __VLS_internalComponent extends { components: infer C } ? C : {}
      > &
        typeof __VLS_componentsOption &
        typeof __VLS_ctx
      let __VLS_otherComponents!: typeof __VLS_localComponents &
        import('./__VLS_types.js').GlobalComponents
      let __VLS_own!: import('./__VLS_types.js').SelfComponent<
        typeof __VLS_name,
        typeof __VLS_internalComponent &
          typeof __VLS_publicComponent &
          (new () => { $slots: typeof __VLS_slots })
      >
      let __VLS_components!: typeof __VLS_otherComponents &
        Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>
      /* Style Scoped */
      type __VLS_StyleScopedClasses = {}
      let __VLS_styleScopedClasses!:
        | __VLS_StyleScopedClasses
        | keyof __VLS_StyleScopedClasses
        | (keyof __VLS_StyleScopedClasses)[]
      /* CSS variable injection */
      /* CSS variable injection end */
      let __VLS_templateComponents!: {} & import('./__VLS_types.js').WithComponent<
        'ElButton',
        typeof __VLS_components,
        'ElButton',
        'elButton',
        'el-button'
      > &
        import('./__VLS_types.js').WithComponent<
          'ElForm',
          typeof __VLS_components,
          'ElForm',
          'elForm',
          'el-form'
        > &
        import('./__VLS_types.js').WithComponent<
          'ElFormItem',
          typeof __VLS_components,
          'ElFormItem',
          'elFormItem',
          'el-form-item'
        > &
        import('./__VLS_types.js').WithComponent<
          'ElInput',
          typeof __VLS_components,
          'ElInput',
          'elInput',
          'el-input'
        > &
        import('./__VLS_types.js').WithComponent<
          'ElTable',
          typeof __VLS_components,
          'ElTable',
          'elTable',
          'el-table'
        > &
        import('./__VLS_types.js').WithComponent<
          'ElTableColumn',
          typeof __VLS_components,
          'ElTableColumn',
          'elTableColumn',
          'el-table-column'
        > &
        import('./__VLS_types.js').WithComponent<
          'ElCheckbox',
          typeof __VLS_components,
          'ElCheckbox',
          'elCheckbox',
          'el-checkbox'
        > &
        import('./__VLS_types.js').WithComponent<
          'ElDivider',
          typeof __VLS_components,
          'ElDivider',
          'elDivider',
          'el-divider'
        > &
        import('./__VLS_types.js').WithComponent<
          'Pagination',
          typeof __VLS_components,
          'Pagination'
        > &
        import('./__VLS_types.js').WithComponent<
          'RoleForm',
          typeof __VLS_components,
          'RoleForm'
        > &
        import('./__VLS_types.js').WithComponent<
          'RoleAssignMenuDrawer',
          typeof __VLS_components,
          'RoleAssignMenuDrawer'
        >
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.ElButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components.elButton
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      __VLS_components['el-button']
      // @ts-ignore
      ;[
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton,
        ElButton
      ]
      __VLS_components.ElForm
      __VLS_components.ElForm
      __VLS_components.elForm
      __VLS_components.elForm
      __VLS_components['el-form']
      __VLS_components['el-form']
      // @ts-ignore
      ;[ElForm, ElForm]
      __VLS_components.ElFormItem
      __VLS_components.ElFormItem
      __VLS_components.ElFormItem
      __VLS_components.ElFormItem
      __VLS_components.elFormItem
      __VLS_components.elFormItem
      __VLS_components.elFormItem
      __VLS_components.elFormItem
      __VLS_components['el-form-item']
      __VLS_components['el-form-item']
      __VLS_components['el-form-item']
      __VLS_components['el-form-item']
      // @ts-ignore
      ;[ElFormItem, ElFormItem, ElFormItem, ElFormItem]
      __VLS_components.ElInput
      __VLS_components.elInput
      __VLS_components['el-input']
      // @ts-ignore
      ;[ElInput]
      __VLS_components.ElTable
      __VLS_components.ElTable
      __VLS_components.elTable
      __VLS_components.elTable
      __VLS_components['el-table']
      __VLS_components['el-table']
      // @ts-ignore
      ;[ElTable, ElTable]
      __VLS_components.ElTableColumn
      __VLS_components.ElTableColumn
      __VLS_components.ElTableColumn
      __VLS_components.ElTableColumn
      __VLS_components.ElTableColumn
      __VLS_components.ElTableColumn
      __VLS_components.ElTableColumn
      __VLS_components.elTableColumn
      __VLS_components.elTableColumn
      __VLS_components.elTableColumn
      __VLS_components.elTableColumn
      __VLS_components.elTableColumn
      __VLS_components.elTableColumn
      __VLS_components.elTableColumn
      __VLS_components['el-table-column']
      __VLS_components['el-table-column']
      __VLS_components['el-table-column']
      __VLS_components['el-table-column']
      __VLS_components['el-table-column']
      __VLS_components['el-table-column']
      __VLS_components['el-table-column']
      // @ts-ignore
      ;[
        ElTableColumn,
        ElTableColumn,
        ElTableColumn,
        ElTableColumn,
        ElTableColumn,
        ElTableColumn,
        ElTableColumn
      ]
      __VLS_components.ElCheckbox
      __VLS_components.elCheckbox
      __VLS_components['el-checkbox']
      // @ts-ignore
      ;[ElCheckbox]
      __VLS_components.ElDivider
      __VLS_components.ElDivider
      __VLS_components.elDivider
      __VLS_components.elDivider
      __VLS_components['el-divider']
      __VLS_components['el-divider']
      // @ts-ignore
      ;[ElDivider, ElDivider]
      __VLS_components.Pagination
      // @ts-ignore
      ;[Pagination]
      __VLS_components.RoleForm
      // @ts-ignore
      ;[RoleForm]
      __VLS_components.RoleAssignMenuDrawer
      // @ts-ignore
      ;[RoleAssignMenuDrawer]
      {
        ;(({}) as JSX.IntrinsicElements).div
        ;(({}) as JSX.IntrinsicElements).div
        ;(__VLS_x as JSX.IntrinsicElements)['div'] = { class: 'page' }
        {
          ;(({}) as JSX.IntrinsicElements).div
          ;(({}) as JSX.IntrinsicElements).div
          ;(__VLS_x as JSX.IntrinsicElements)['div'] = {
            class: 'table-header table-header-split'
          }
          {
            ;(({}) as JSX.IntrinsicElements).div
            ;(({}) as JSX.IntrinsicElements).div
            ;(__VLS_x as JSX.IntrinsicElements)['div'] = { class: 'btn' }
            {
              ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                typeof __VLS_templateComponents.ElButton
              >) = { type: 'info', icon: __VLS_ctx.RefreshRight }
              const __VLS_0 = new __VLS_templateComponents.ElButton({
                type: 'info',
                icon: __VLS_ctx.RefreshRight
              })
              const __VLS_1 = __VLS_templateComponents.ElButton({
                type: 'info',
                icon: __VLS_ctx.RefreshRight
              })
              let __VLS_2!: import('./__VLS_types.js').PickNotAny<
                typeof __VLS_0,
                typeof __VLS_1
              >
              type __VLS_3 = import('./__VLS_types.js').InstanceProps<
                typeof __VLS_2,
                typeof __VLS_templateComponents.ElButton
              >
              const __VLS_4: import('./__VLS_types.js').EventObject<
                typeof __VLS_2,
                'click',
                typeof __VLS_templateComponents.ElButton,
                __VLS_3['onClick']
              > = {
                click: __VLS_ctx.getRolePage
              }
              // @ts-ignore
              ;[RefreshRight, RefreshRight, RefreshRight, getRolePage]
            }
            {
              __VLS_templateComponents.ElButton
              ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                typeof __VLS_templateComponents.ElButton
              >) = { type: 'primary', icon: __VLS_ctx.Plus }
              const __VLS_5 = new __VLS_templateComponents.ElButton({
                type: 'primary',
                icon: __VLS_ctx.Plus
              })
              const __VLS_6 = __VLS_templateComponents.ElButton({
                type: 'primary',
                icon: __VLS_ctx.Plus
              })
              let __VLS_7!: import('./__VLS_types.js').PickNotAny<
                typeof __VLS_5,
                typeof __VLS_6
              >
              type __VLS_8 = import('./__VLS_types.js').InstanceProps<
                typeof __VLS_7,
                typeof __VLS_templateComponents.ElButton
              >
              const __VLS_9: import('./__VLS_types.js').EventObject<
                typeof __VLS_7,
                'click',
                typeof __VLS_templateComponents.ElButton,
                __VLS_8['onClick']
              > = {
                click: ($event) => {
                  __VLS_ctx.openForm(undefined)
                }
              }
              // @ts-ignore
              ;[Plus, Plus, Plus, openForm]
            }
          }
          {
            __VLS_templateComponents.ElForm
            ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
              typeof __VLS_templateComponents.ElForm
            >) = { ref: 'queryFormRef', inline: true }
            // @ts-ignore
            __VLS_ctx.queryFormRef
            // @ts-ignore
            ;[queryFormRef]
            {
              __VLS_templateComponents.ElFormItem
              ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                typeof __VLS_templateComponents.ElFormItem
              >) = {}
              {
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElInput
                >) = { placeholder: '输入角色名称搜索', clearable: true }
              }
            }
            {
              __VLS_templateComponents.ElFormItem
              ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                typeof __VLS_templateComponents.ElFormItem
              >) = {}
              {
                __VLS_templateComponents.ElButton
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElButton
                >) = { type: 'primary', icon: __VLS_ctx.Search }
                // @ts-ignore
                ;[Search]
              }
            }
          }
        }
        {
          __VLS_templateComponents.ElTable
          ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
            typeof __VLS_templateComponents.ElTable
          >) = {
            ref: 'tableRef',
            data: __VLS_ctx.tableData,
            border: true,
            stripe: true,
            showOverflowTooltip: true,
            'show-overflow-tooltip': true,
            class: 'menu-table'
          }
          ;(await import('./__VLS_types.js')).directiveFunction(
            __VLS_ctx.vLoading
          )(__VLS_ctx.tableLoading)
          // @ts-ignore
          ;[tableData, tableLoading]
          // @ts-ignore
          __VLS_ctx.tableRef
          // @ts-ignore
          ;[tableRef]
          {
            ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
              typeof __VLS_templateComponents.ElTableColumn
            >) = { align: 'center', label: '角色名称', prop: 'name' }
          }
          {
            ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
              typeof __VLS_templateComponents.ElTableColumn
            >) = { align: 'center', label: '备注', prop: 'remark' }
          }
          {
            __VLS_templateComponents.ElTableColumn
            ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
              typeof __VLS_templateComponents.ElTableColumn
            >) = { align: 'center', label: '默认角色', prop: 'isDefault' }
            {
              ;(({}) as JSX.IntrinsicElements).template
              ;(({}) as JSX.IntrinsicElements).template
              ;(__VLS_x as JSX.IntrinsicElements)['template'] = {}
              const __VLS_10 = new __VLS_templateComponents.ElTableColumn({
                align: 'center',
                label: '默认角色',
                prop: 'isDefault'
              })
              const __VLS_11 = __VLS_templateComponents.ElTableColumn({
                align: 'center',
                label: '默认角色',
                prop: 'isDefault'
              })
              let __VLS_12!: import('./__VLS_types.js').ExtractComponentSlots<
                import('./__VLS_types.js').PickNotAny<
                  typeof __VLS_10,
                  typeof __VLS_11
                >
              >
              const { row } = __VLS_12.default
              {
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElCheckbox
                >) = { modelValue: row.isDefault }
                const __VLS_13 = new __VLS_templateComponents.ElCheckbox({
                  modelValue: row.isDefault
                })
                const __VLS_14 = __VLS_templateComponents.ElCheckbox({
                  modelValue: row.isDefault
                })
                let __VLS_15!: import('./__VLS_types.js').PickNotAny<
                  typeof __VLS_13,
                  typeof __VLS_14
                >
                type __VLS_16 = import('./__VLS_types.js').InstanceProps<
                  typeof __VLS_15,
                  typeof __VLS_templateComponents.ElCheckbox
                >
                const __VLS_17: import('./__VLS_types.js').EventObject<
                  typeof __VLS_15,
                  'change',
                  typeof __VLS_templateComponents.ElCheckbox,
                  __VLS_16['onChange']
                > = {
                  change: ($event) => {
                    __VLS_ctx.handleDefaultChange(row.id, row.isDefault)
                  }
                }
                // @ts-ignore
                ;[handleDefaultChange]
              }
            }
          }
          {
            ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
              typeof __VLS_templateComponents.ElTableColumn
            >) = {
              align: 'center',
              label: '创建时间',
              prop: 'createTime',
              formatter: __VLS_ctx.dateFormatter
            }
            // @ts-ignore
            ;[dateFormatter]
          }
          {
            __VLS_templateComponents.ElTableColumn
            ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
              typeof __VLS_templateComponents.ElTableColumn
            >) = { align: 'center', label: '操作', width: '300' }
            {
              ;(({}) as JSX.IntrinsicElements).template
              ;(({}) as JSX.IntrinsicElements).template
              ;(__VLS_x as JSX.IntrinsicElements)['template'] = {}
              const __VLS_18 = new __VLS_templateComponents.ElTableColumn({
                align: 'center',
                label: '操作',
                width: '300'
              })
              const __VLS_19 = __VLS_templateComponents.ElTableColumn({
                align: 'center',
                label: '操作',
                width: '300'
              })
              let __VLS_20!: import('./__VLS_types.js').ExtractComponentSlots<
                import('./__VLS_types.js').PickNotAny<
                  typeof __VLS_18,
                  typeof __VLS_19
                >
              >
              const { row } = __VLS_20.default
              {
                __VLS_templateComponents.ElButton
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElButton
                >) = { link: true, type: 'primary', size: 'small' }
              }
              {
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElDivider
                >) = { direction: 'vertical' }
              }
              {
                __VLS_templateComponents.ElButton
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElButton
                >) = { link: true, type: 'primary', size: 'small' }
                const __VLS_21 = new __VLS_templateComponents.ElButton({
                  link: true,
                  type: 'primary',
                  size: 'small'
                })
                const __VLS_22 = __VLS_templateComponents.ElButton({
                  link: true,
                  type: 'primary',
                  size: 'small'
                })
                let __VLS_23!: import('./__VLS_types.js').PickNotAny<
                  typeof __VLS_21,
                  typeof __VLS_22
                >
                type __VLS_24 = import('./__VLS_types.js').InstanceProps<
                  typeof __VLS_23,
                  typeof __VLS_templateComponents.ElButton
                >
                const __VLS_25: import('./__VLS_types.js').EventObject<
                  typeof __VLS_23,
                  'click',
                  typeof __VLS_templateComponents.ElButton,
                  __VLS_24['onClick']
                > = {
                  click: ($event) => {
                    __VLS_ctx.openForm(row.id)
                  }
                }
                // @ts-ignore
                ;[openForm]
              }
              {
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElDivider
                >) = { direction: 'vertical' }
              }
              {
                __VLS_templateComponents.ElButton
                ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
                  typeof __VLS_templateComponents.ElButton
                >) = { link: true, type: 'danger', size: 'small' }
                const __VLS_26 = new __VLS_templateComponents.ElButton({
                  link: true,
                  type: 'danger',
                  size: 'small'
                })
                const __VLS_27 = __VLS_templateComponents.ElButton({
                  link: true,
                  type: 'danger',
                  size: 'small'
                })
                let __VLS_28!: import('./__VLS_types.js').PickNotAny<
                  typeof __VLS_26,
                  typeof __VLS_27
                >
                type __VLS_29 = import('./__VLS_types.js').InstanceProps<
                  typeof __VLS_28,
                  typeof __VLS_templateComponents.ElButton
                >
                const __VLS_30: import('./__VLS_types.js').EventObject<
                  typeof __VLS_28,
                  'click',
                  typeof __VLS_templateComponents.ElButton,
                  __VLS_29['onClick']
                > = {
                  click: ($event) => {
                    __VLS_ctx.handleDel(row.id)
                  }
                }
                // @ts-ignore
                ;[handleDel]
              }
            }
          }
        }
        {
          ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
            typeof __VLS_templateComponents.Pagination
          >) = {
            limit: __VLS_ctx.queryParams.size,
            page: __VLS_ctx.queryParams.current,
            total: __VLS_ctx.total
          }
          const __VLS_31 = new __VLS_templateComponents.Pagination({
            limit: __VLS_ctx.queryParams.size,
            page: __VLS_ctx.queryParams.current,
            total: __VLS_ctx.total
          })
          const __VLS_32 = __VLS_templateComponents.Pagination({
            limit: __VLS_ctx.queryParams.size,
            page: __VLS_ctx.queryParams.current,
            total: __VLS_ctx.total
          })
          let __VLS_33!: import('./__VLS_types.js').PickNotAny<
            typeof __VLS_31,
            typeof __VLS_32
          >
          type __VLS_34 = import('./__VLS_types.js').InstanceProps<
            typeof __VLS_33,
            typeof __VLS_templateComponents.Pagination
          >
          const __VLS_35: import('./__VLS_types.js').EventObject<
            typeof __VLS_33,
            'pagination',
            typeof __VLS_templateComponents.Pagination,
            __VLS_34['onPagination']
          > = {
            pagination: __VLS_ctx.getRolePage
          }
          // @ts-ignore
          ;[
            queryParams,
            queryParams,
            total,
            queryParams,
            queryParams,
            total,
            queryParams,
            queryParams,
            total,
            getRolePage
          ]
        }
      }
      {
        ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
          typeof __VLS_templateComponents.RoleForm
        >) = { ref: 'formRef' }
        // @ts-ignore
        __VLS_ctx.formRef
        // @ts-ignore
        ;[formRef]
        const __VLS_36 = new __VLS_templateComponents.RoleForm({
          ref: 'formRef'
        })
        const __VLS_37 = __VLS_templateComponents.RoleForm({ ref: 'formRef' })
        let __VLS_38!: import('./__VLS_types.js').PickNotAny<
          typeof __VLS_36,
          typeof __VLS_37
        >
        type __VLS_39 = import('./__VLS_types.js').InstanceProps<
          typeof __VLS_38,
          typeof __VLS_templateComponents.RoleForm
        >
        const __VLS_40: import('./__VLS_types.js').EventObject<
          typeof __VLS_38,
          'success',
          typeof __VLS_templateComponents.RoleForm,
          __VLS_39['onSuccess']
        > = {
          success: __VLS_ctx.getRolePage
        }
        // @ts-ignore
        ;[getRolePage]
      }
      {
        ;(__VLS_x as import('./__VLS_types.js').ComponentProps<
          typeof __VLS_templateComponents.RoleAssignMenuDrawer
        >) = { ref: 'menuDrawerRef' }
        // @ts-ignore
        __VLS_ctx.menuDrawerRef
        // @ts-ignore
        ;[menuDrawerRef]
        const __VLS_41 = new __VLS_templateComponents.RoleAssignMenuDrawer({
          ref: 'menuDrawerRef'
        })
        const __VLS_42 = __VLS_templateComponents.RoleAssignMenuDrawer({
          ref: 'menuDrawerRef'
        })
        let __VLS_43!: import('./__VLS_types.js').PickNotAny<
          typeof __VLS_41,
          typeof __VLS_42
        >
        type __VLS_44 = import('./__VLS_types.js').InstanceProps<
          typeof __VLS_43,
          typeof __VLS_templateComponents.RoleAssignMenuDrawer
        >
        const __VLS_45: import('./__VLS_types.js').EventObject<
          typeof __VLS_43,
          'success',
          typeof __VLS_templateComponents.RoleAssignMenuDrawer,
          __VLS_44['onSuccess']
        > = {
          success: __VLS_ctx.getRolePage
        }
        // @ts-ignore
        ;[getRolePage]
      }
      if (
        typeof __VLS_styleScopedClasses === 'object' &&
        !Array.isArray(__VLS_styleScopedClasses)
      ) {
      }
      declare var __VLS_slots: {}
      return __VLS_slots
    }
    const __VLS_internalComponent = (await import('vue')).defineComponent({
      setup() {
        return {
          RefreshRight: RefreshRight,
          Plus: Plus,
          Search: Search,
          dateFormatter: dateFormatter,
          RoleForm: RoleForm,
          RoleAssignMenuDrawer: RoleAssignMenuDrawer,
          tableLoading: tableLoading,
          tableData: tableData,
          formRef: formRef,
          menuDrawerRef: menuDrawerRef,
          total: total,
          queryParams: queryParams,
          getRolePage: getRolePage,
          openForm: openForm,
          openForm: openForm,
          handleDel: handleDel,
          handleDefaultChange: handleDefaultChange
        }
      }
    })
    return {} as typeof __VLS_publicComponent
  }
  return {} as typeof __VLS_setup extends () => Promise<infer T> ? T : never
})({} as any)
