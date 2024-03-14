import LocalAxios from '@/utils/axios';

class BaseMethod extends LocalAxios {
    public get<P extends Record<string, any>>(url: string, params?: P): any {
        return this.axs.get(url, { params });
    }

    public post<D extends Record<string, any>>(url: string, data?: D): any {
        return this.axs.post(url, data);
    }
}

class Api extends BaseMethod {
    public getList(params: API.I18n.List.Params): Promise<API.I18n.List.Response> {
        return this.get('/api/i18n/list', params);
    }

    public translateOne(data: API.I18n.Translate.One.Params): Promise<API.I18n.Translate.One.Response> {
        return this.post('/api/i18n/translate/one', data);
    }

    public updateOne(data: API.I18n.Update.One.Params): Promise<API.I18n.Update.One.Response> {
        return this.post('/api/i18n/update/one', data)
    }

    public getProjects(): Promise<API.I18n.Project.Names.Response> {
        return this.get('/api/i18n/project/names');
    }

    public login(data: API.User.Login.Params): Promise<API.User.Login.Response> {
        return this.post('/api/user/login', data);
    }

    public analysisParticiple(data: API.I18n.Analysis.Participle.Params): Promise<API.I18n.Analysis.Participle.Response> {
        return this.post('/api/i18n/analysis/participle', data)
    }

    public findSimilarRecommend(data: API.I18n.Similar.Recommend.Params): Promise<API.I18n.Similar.Recommend.Response> {
        return this.post('/api/i18n/similar/recommend', data);
    }
}

export const api = new Api();