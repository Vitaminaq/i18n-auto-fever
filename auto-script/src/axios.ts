import axios from 'axios';

export const localAxios = axios.create({
    baseURL: 'http://127.0.0.1:3002'
});

localAxios.interceptors.response.use((config) => {
    return config.data;
});

interface BaseResponse {
    code: number;
    data: any;
}

export const initAndSync = (data: UploadParams): Promise<BaseResponse> => {
    return localAxios.post('/api/i18n/init-sync', data);
}

interface UploadParams {
    list: any[];
    project: string;
}

export const uploadSource = (params: UploadParams): Promise<BaseResponse> => {
    return localAxios.post('/api/i18n/upload', params);
}
