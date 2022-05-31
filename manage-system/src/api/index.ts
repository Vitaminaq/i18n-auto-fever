import LocalAxios from '@/utils/axios';

class BaseMethod extends LocalAxios {
    public get<P extends Record<string, any>>(url: string, params?: P) {
        return this.axs.get(url, { params });
    }

    public post<D extends Record<string, any>>(url: string, data?: D) {
        return this.axs.post(url, data);
    }
}

class Api extends BaseMethod {
    public getList() {
        return this.get('/api/i18n/list')
    }
}

export const api = new Api();