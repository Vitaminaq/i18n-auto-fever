import { isExit, ListItem, findProject, saveAll, findAll } from './server';
import { multipleTranslate } from './axios';

export const uploadTranslateContent = async (req: any, res: any) => {
    const { list = [], translate = false } = req.body;

    let news: ListItem[] = [];

    await Promise.all(list.map(async (item: ListItem) => {
        try {
            const r = await isExit(item);
            !r && news.push(item);
        } catch(e) {
            res.json({
                code: -1,
                data: e
            });
        }
    }));

    if (translate && news.length) {
        try {
            news = await multipleTranslate(news);
        } catch(e) {
            res.json({
                code: -1,
                data: e
            });
        }
    }

    try {
        await saveAll({ list: news });

        const r1 = await findProject({list});

        res.json({
            code: 0,
            data: r1
        });
    } catch(e) {
        res.json({
            code: -1,
            data: e
        });
    }
};

export const downloadTranslateContent = (req: any, res: any) => {

}

export const getTranslateList = async (req: any, res: any) => {
    const { limit, page } = req.query;
    try {
        const r = await findAll({ limit: limit || 10, page: page || 0 });
        res.json({
            code: 0,
            data: r
        });
    } catch(e) {
        res.json({
            code: -1,
            data: e
        });
    }
};
