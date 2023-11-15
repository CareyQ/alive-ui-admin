const config: {
  base_url: string
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  base_url: import.meta.env.VITE_API_URL,
  result_code: 200,
  request_timeout: 30000,
  default_headers: 'application/json'
}

export { config }
