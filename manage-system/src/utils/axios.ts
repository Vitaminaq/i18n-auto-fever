import axios, { AxiosInstance } from "axios";

export default class LocalAxios {
    public axs: AxiosInstance;

    public constructor() {
        this.axs = axios.create({
            baseURL: 'http://127.0.0.1:3002'
        });
        this.onResponse();
    }

    public onRequest() {
        this.axs.interceptors.request.use((config) => {
            console.log('请求中')
            return config;
        });
    }

    public onResponse() {
        this.axs.interceptors.response.use((res) => {
            return res.data;
        });
    }
}

export const localAxios = new LocalAxios();
