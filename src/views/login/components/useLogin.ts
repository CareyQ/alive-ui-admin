export enum LoginStateEnum {
  LOGIN,
  REGISTER
}

const curState = ref(LoginStateEnum.LOGIN)

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    curState.value = state
  }

  const getLoginState = computed(() => curState.value)

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  return {
    setLoginState,
    getLoginState,
    handleBackLogin
  }
}
