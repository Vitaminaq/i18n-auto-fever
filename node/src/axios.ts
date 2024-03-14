import axios from 'axios';
import { translateAppid, translateKey, translateLanguages, translateLanguagesMap } from './config';
import MD5 from './md5';
import { TaskQueueSync } from "./utils";

interface TranslateParams {
    q: string;
    from: string;
    to: string;
}

const taskQueue = new TaskQueueSync();

export const getTranslateResult = ({ q, from, to }: TranslateParams) => {
    return new Promise((resolve, reject) => {
        return taskQueue.enqueue(async () => {
            try {
                const salt = Date.now();
                const r = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
                    params: {
                        q,
                        from,
                        to,
                        appid: translateAppid,
                        salt,
                        sign: MD5(`${translateAppid}${q}${salt}${translateKey}`)
                    }
                });
                if (r.data.error_code)
                    return reject(r.data);
                // 1s cd
                setTimeout(() => {
                    resolve(r);
                }, 1000);
            } catch (e) {
                reject(e);
            }
        });
    });
};

const formatQuery = (list: any) => {
    let index = 0;
    const len = list.length;
    return () => {
        let str = '';
        for (let i = index; i < len; i++) {
            if (i === len - 1) {
                index = len;
            }
            if (str.length > 2000) {
                index = i;
                str.replace('\n' + list[index].zh_CN, '');
                break;
            }
            str = `${str}${str && '\n'}${list[i].zh_CN}`;
        }
        return str;
    }
}

export const multipleTranslateByLanguage = (list: any[], language = 'en'): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        const getQuery = formatQuery(list);

        let query = getQuery();

        const res: any[] = [];

        while (query) {
            try {
                const r: any = await getTranslateResult({
                    q: query,
                    from: 'zh',
                    to: language
                });
                Array.prototype.push.apply(res, r.data.trans_result);
                query = getQuery();
            } catch (e) {
                query = '';
                reject(e);
            }
        }
        resolve(res);
    });
};

export const multipleTranslate = (list: any): Promise<any> => {
    let index = 0;
    const len = translateLanguages.length;
    return new Promise(async (resolve, reject) => {
        while (index < len) {
            try {
                const key = translateLanguages[index];
                const r = await multipleTranslateByLanguage(list, translateLanguagesMap[key]);
                const map = new Map();
                r.forEach(({ src, dst }: any) => {
                    map.set(src, dst);
                });
                list = list.map((i: any) => {
                    return {
                        ...i,
                        [key]: map.get(i.zh_CN)
                    };
                });
                index++;
            } catch (e) {
                reject(e);
            }
        }
        resolve(list);
    });
};

export default axios;
