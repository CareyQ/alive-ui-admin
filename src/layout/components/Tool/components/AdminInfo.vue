<script lang="ts" setup>
import DropdownMenuItem from './DropdownMenuItem.vue'

const isVisible = ref<boolean>(false)

const dropdownChange = (visible: boolean) => {
  isVisible.value = visible
}
</script>

<template>
  <el-dropdown
    trigger="click"
    @visible-change="dropdownChange"
    popper-class="admin-dropdown"
    :teleported="false"
  >
    <div :class="[isVisible && 'is-active', 'avatar-wrap', 'flex-center']">
      <el-avatar
        ref="avatarRef"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      />
    </div>
    <template #dropdown>
      <div class="username no-wrap ellipsis">Admin</div>
      <div class="login-time">
        <span style="font-size: 14px">2023-11-19 13:00:00</span>
      </div>

      <ul class="dropdown-menu">
        <DropdownMenuItem icon="mdi:account-box-outline" text="个人资料" />
        <DropdownMenuItem icon="mdi:exit-to-app" text="退出登录" />
      </ul>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.el-dropdown {
  position: relative;
  z-index: 2010;
  padding: 0 10px;
  height: 100%;
  width: 44px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: var(--login-bg-color);
  }
}

.avatar-wrap {
  position: absolute;
  animation: fadeIn 0.6s both;
  height: 100%;
  z-index: 2010;
}

.el-avatar {
  width: 24px;
  height: 24px;
}

.avatar-wrap.is-active {
  animation: fadeOut 0.35s both;
}

.username {
  padding: 16px 0 6px 16px;
  font-size: 18px;
  font-weight: 500;
  max-width: 70%;
}

.login-time {
  padding-left: 16px;
  opacity: 0.8;
}

.dropdown-menu {
  margin: 16px 0 6px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--admin-dropdown-color);
}

@keyframes fadeOut {
  0% {
    transform: scale(1) translate(0, 0);
  }

  to {
    transform: scale(2.5) translate(0, 14px);
  }
}

@keyframes fadeIn {
  0% {
    transform: scale(2.5) translate(0, 14px);
  }

  to {
    transform: scale(1) translate(0, 0);
  }
}
</style>

<style lang="scss">
.admin-dropdown {
  z-index: 2009 !important;
  width: 220px;
  top: 55px !important;
  left: -135px !important;
  .el-popper__arrow {
    display: none;
  }
}
</style>
