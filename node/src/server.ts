import { I18nModel } from './db/model';

export interface ListItem {
    key: string;
    zh: string,
    en?: {
        value: string;
        lock: boolean;
    }
}

export interface SaveAllParams {
    list: ListItem[];
    translate?: boolean;
}

export const isExit = ({ key, zh }: ListItem) => {
    return new Promise((resolve, reject) => 
        I18nModel.find({ key, zh }).exec((err, res) => {
            err ? reject(err) : resolve(res.length);
        })
    );
}

export const saveAll = ({ list }: SaveAllParams) => {
    return new Promise(async (resolve, reject) => {

        if (!list.length) resolve(true);

        try {
            const r = await I18nModel.insertMany(list);
            resolve(r);
        } catch(e) {
            reject(e);
        }
    });
};

export const findProject = ({ list }: SaveAllParams) => {
    return new Promise(async (resolve, reject) => {
        I18nModel.find().or(list).exec((err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
};

interface FindAllParams {
    limit: number;
    page: number;
}

export const findAll = ({ limit, page }: FindAllParams) => {
    return new Promise((resolve, reject) => {
        I18nModel.find().limit(limit).skip(limit * page).sort({ create_time: 1 }).exec((err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
};
