import express from "express";
import { uploadTranslateContent, getTranslateList } from './control';

const router = express.Router();

export default () => {
    // 上传翻译文本
    router.post('/upload', uploadTranslateContent);

    // 下载翻译内容
    router.get('/download');

    // 翻译列表
    router.get('/list', getTranslateList);

    // 锁定某个翻译
    router.post('/lock');

    // 更新某个翻译
    router.post('/update');

    return router;
}