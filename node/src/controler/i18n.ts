import { isInit, isExit, ListItem, findProject, saveAll, findAll, updateOneServer, getTotal, findProjectNames, similarRecommendServer, type FindAllParams, type listResultItem } from '../server/i18n';
import { getTranslateResult } from '../axios';
import express from "express";
import { extract } from "@node-rs/jieba";

export const initAndSync =  async (req: express.Request, res: express.Response) => {
    const { list = [], project } = req.body;

    try {
        const init = await isInit(project);
        if (init) return res.fail("该项目已经初始化过了，请勿重复初始化");

        await saveAll(list.map((i: any) => {
            return {
                ...i,
                project
            }
        }));
        res.success("success");
    } catch(e) {
        res.fail(e);
    }   
}

export const uploadTranslateContent = async (req: express.Request, res: express.Response) => {
    const { list = [], project } = req.body;

    const news: ListItem[] = [];

    await Promise.all(list.map(async (item: ListItem) => {
        try {
            const i = {...item, project};
            const r = await isExit(i);
            !r && news.push(i);
        } catch(e) {
            res.fail(e);
        }
    }));

    // if (translate && news.length) {
    //     try {
    //         news = await multipleTranslate(news);
    //     } catch(e) {
    //         res.json({
    //             code: -1,
    //             data: e
    //         });
    //     }
    // }

    try {
        await saveAll(news);

        const r1 = await findProject({list});

        res.success(r1);
    } catch(e) {
        res.fail(e);
    }
};

export const downloadTranslateContent = (req: any, res: any) => {

}

interface GetTranslateListOptions {
    limit?: number;
    page?: number;
    sort?: number;
    field?: string;
    project?: string;
    filter_zh?: string;
    omit?: number;
}

export const getTranslateList = async (req: express.Request, res: express.Response) => {
    const { limit, page, sort, project, filter_zh, omit } = req.query as GetTranslateListOptions;

    try {
        const item: FindAllParams["item"] = {};

        if (project) {
            item.project = project;
        }

        if (filter_zh) {
            item.zh_CN = new RegExp(filter_zh, "g")
        }

        if (omit && Number(omit)) {
            item.$or = [{ en: "" }, { jp: "" }, { kr: "" }, { ru: "" }];
        }
        const [r1, r2] = await Promise.all([
            findAll({
                limit: Number(limit) || 10,
                page: Number(page) || 0,
                sort: sort ? sort : -1,
                field: "create_time",
                item
            }),
            getTotal(item)
        ]);

        res.success({
            total: r2,
            list: r1
        });
    } catch(e) {
        res.fail(e);
    }
};

export const translateOne = async (req: express.Request, res: express.Response) => {
    const { text, to } = req.body;

    return getTranslateResult({
        q: text,
        from: "zh",
        to
    }).then((r: any) => {
        res.success(r.data.trans_result[0]);
    }).catch((e) => {
        res.fail(e);
    });
}

export const updateOne = async (req: express.Request, res: express.Response) => {
    const { id, content } = req.body;

    return updateOneServer({
        id,
        content
    }).then((r) => {
        res.success(r);
    }).catch((e) => {
        res.fail(e);
    })
}

export const findAllProjectName = (req: express.Request, res: express.Response) => {
    return findProjectNames().then((r) => {
        res.success(r);
    }).catch((e) => {
        res.fail(e);
    });
}

export const analysisParticiple = (req: express.Request, res: express.Response) => {
    const { text, num } = req.body;

    const allowedPos = num ? num : 2;

    try {
        res.success(extract(text, allowedPos));
    } catch(e) {
        res.fail(e);
    }
}

export const similarRecommend = (req: express.Request, res: express.Response) => {
    const { text } = req.body;

    const keywords = extract(text, 2).map(i => i.keyword);
    const promises: (() => Promise<listResultItem[]>)[] = [];

    for(let i = 0; i < 2; i++) {
        promises.push(() => similarRecommendServer(new RegExp(keywords[i], "g")));
    }
    return Promise.all(promises.map(i => i())).then(([r1, r2]) => {
        const map = new Map<string, listResultItem>();
        r1.forEach(i1 => {
            map.set(i1._id, i1);
        });
        r2.forEach(i2 => {
            map.set(i2._id, i2);
        })
        res.success([...map.values()].filter(i => {
            const kws = extract(i.zh_CN, 2);

            const has = kws.filter(ki => keywords.includes(ki.keyword)).length;
            return has;
        }));
    }).catch((e) => {
        res.fail(e);
    });
}
