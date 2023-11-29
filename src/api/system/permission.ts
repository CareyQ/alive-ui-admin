import request from '@/utils/axios'

export interface PermissionAssign {
  primaryId: number
  linkIds: number[]
}

export const getRoleMenuList = (roleId: number) => {
  return request.get({
    url: '/system/permission/list-role-menu?roleId=' + roleId
  })
}

export const assignRoleMenu = (data: PermissionAssign) => {
  return request.post({ url: '/system/permission/assign-role-menu', data })
}
