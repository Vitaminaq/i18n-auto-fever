import axios, { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";

let instance: any;

const toLogin = () => {
  if (instance) return;
  instance = ElMessage.error({
    message: "token验证失败，请重新登录",
    duration: 1500,
    onClose: () => {
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    },
  });
};

export default class LocalAxios {
  public axs: AxiosInstance;

  public constructor() {
    this.axs = axios.create({
      baseURL: "http://127.0.0.1:5235",
      timeout: 5000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    // this.onRequest();
    this.onResponse();
  }

  public onRequest() {
    this.axs.interceptors.request.use((config) => {
      // if (config.url && config.url.match("/i18n/")) {
      //     config.headers = {
      //         ...config.headers,

      //     }
      // }
      console.log('请求中', config);
      return config;
    });
  }

  public onResponse() {
    this.axs.interceptors.response.use((res) => {
      if (res.data.code === -2) return toLogin();
      return res.data;
    });
  }
}

export const localAxios = new LocalAxios();
