// eslint-disable-next-line import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
export { AxiosError } from 'axios'

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
}

export { $axios }
