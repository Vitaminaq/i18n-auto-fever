import { Router } from "express";
import {
  uploadTranslateContent,
  getTranslateList,
  translateOne,
  initAndSync,
  updateOne,
  findAllProjectName,
  similarRecommend,
  analysisParticiple,
} from "../controler/i18n";
import { decodeToken } from "../middleware/token";

export const i18nRouter = (router: Router) => {
  // 初始化项目
  router.post("/init-sync", initAndSync);
  // 上传翻译文本
  router.post("/upload", uploadTranslateContent);

  // 下载翻译内容
  router.get("/download");

  // 翻译列表
  router.get("/list", decodeToken, getTranslateList);

  // 锁定某个翻译
  router.post("/lock");

  // 更新某个翻译
  router.post("/update/one", decodeToken, updateOne);

  // 机翻一条
  router.post("/translate/one", decodeToken, translateOne);

  // 项目条目
  router.get("/project/names", decodeToken, findAllProjectName);

  // 分词
  router.post("/analysis/participle", decodeToken, analysisParticiple);

  // 相似翻译推荐
  router.post("/similar/recommend", decodeToken, similarRecommend);

  return router;
};
