import axios, { AxiosInstance } from "axios"
import { api } from "../api/connector"
// import { tokenGetValue } from "./token"

const envApiUrl = '/api'
console.log("[env] API_URL", envApiUrl)

export const defaultInstance = axios.create({
    baseURL: envApiUrl,
})

const useApi = (endpoint?: string) => {
    let instance = null
    if (endpoint) {
        instance = axios.create({
            baseURL: endpoint,
        })
    } else {
        instance = defaultInstance
    }

    // instance.interceptors.request.use(
    //     async config => {
    //         return config
    //     },
    // )

    // instance.interceptors.response.use(
    //     async (res: any): Promise<any> => {
    //       return res;
    //     },
    //     (error: any) => {
    //       return Promise.reject(error);
    //     },
    // )

    const _api = api.bind(null, instance)

  return {
    api: _api,
  }
}

export default useApi
