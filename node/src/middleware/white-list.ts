import express from "express";

// 跨域白名单设置
export const whiteList = function (req: express.Request, res: express.Response, next: any) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type, authorization, Cache-Control");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', "60");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", 10000);

    if (req.method === 'OPTIONS') {
        return next();
    }
    next();
};