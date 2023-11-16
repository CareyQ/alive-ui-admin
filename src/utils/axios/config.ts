const config: {
  base_url: string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  base_url: import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL,
  request_timeout: 30000,
  default_headers: 'application/json'
}

export { config }
