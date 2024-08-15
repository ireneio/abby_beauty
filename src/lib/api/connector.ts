import { AxiosInstance, AxiosRequestConfig } from "axios"

export const api = (instance: AxiosInstance, config: AxiosRequestConfig) => {
    const { method, url, headers, ...rest } = config
    const payload = {
      method,
      url,
      // headers: {
      //   // automatically insert token from window.localStorage
      //   Authorization: `Bearer ${tokenGetValue()}`,
      // },
      ...rest,
    }
    // define response "message" key from API interface
    const responseMessageKey = "message"
  
    return instance
      .request(payload)
      .then((res) => {
        // define data layer map from API interface
        const data = res.data?.data !== undefined ? res.data?.data : res.data
        return {
          success: true,
          code: res.data?.code,
          message: res.data?.[responseMessageKey] || "success",
          data,
        }
      })
      .catch((err) => {
        console.error(err)
        return {
          success: false,
          code: 1,
          // priotiy: 1. backend resoonse 2. axios error 3. customized text
          message:
            err?.response?.data?.[responseMessageKey] ||
            String(err?.response?.data) ||
            "error",
          data: null,
        }
      })
  }
