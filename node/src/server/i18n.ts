import { I18nModel } from '../db/model';

export interface ListItem {
    key: string;
    zh_CN: string;
    en?: string;
    jp?: string;
    kr?: string;
    ru?: string;
    project: string;
    path: string;
}

export interface SaveAllParams {
    list: ListItem[];
}

export const isInit = (project: string) => {
    return new Promise((resolve, reject) => {
        I18nModel.find({ project }).exec((err, res) => {
            err ? reject(err) : resolve(res.length);
        })
    });
}

export const isExit = ({ key, project, path }: ListItem) => {
    return new Promise((resolve, reject) => 
        I18nModel.find({ key, project, path }).exec((err, res) => {
            err ? reject(err) : resolve(res.length);
        })
    );
}

export const saveAll = (list: ListItem[]) => {
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

export interface FindAllParams {
    limit: number;
    page: number;
    sort: number; // -1 | 1 降序 | 升序
    field: string;
    item: {
        project?: string;
        zh_CN?: string | RegExp;
        $or?: any[];
    },
    orItem?: any[];
}

export interface listResultItem {
    _id: string;
    project: string;
    path: string;
    key: string;
    zh_CN: string;
    en: string;
    jp: string;
    kr: string;
    ru: string;
    create_time: string;
    update_time: string;
}

export const findAll = ({ limit, page, sort, field, item, orItem }: FindAllParams) => {
    return new Promise((resolve, reject) => {
        I18nModel.find(item).limit(limit).skip(limit * page).sort({ [field]: sort }).exec((err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
};

export const getTotal = (item: FindAllParams["item"]) => {
    return new Promise((resolve, reject) => {
        I18nModel.countDocuments(item, undefined, (err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
}

export const updateOneServer = ({ id, content }: any) => {
    return new Promise((resolve, reject) => {
        I18nModel.findByIdAndUpdate(id, content, { new: true }).exec((err, res) => {
            err ? reject(err) : resolve(res);
        });
    })
}

export const findProjectNames = () => {
    return new Promise((resolve, reject) => {
        I18nModel.distinct("project", undefined, (err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
}

export const similarRecommendServer = (reg: string | RegExp): Promise<listResultItem[]> => {
    return new Promise((resolve, reject) => {
        I18nModel.find({ zh_CN: reg }).exec((err, res) => {
            err ? reject(err) : resolve(res);
        });
    })
}
