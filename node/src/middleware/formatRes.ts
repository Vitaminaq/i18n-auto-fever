import express from "express";

export const formatRes = (req: express.Request, res: express.Response, next: any) => {
    res.success = (data: any) => {
        return res.json({
            code: 0,
            data
        });
    }

    res.fail = (e: any) => {
        return res.json({
            code: -1,
            data: e
        });
    }

    res.unLogin = (data: any) => {
        return res.json({
            code: -2,
            data
        });
    }
    next();
};

declare global {
    namespace Express {
        interface Request {}
        interface Response {
            success: (data: any) => any;
            fail: (e: any) => any;
            unLogin: (e: any) => any;
        }
    }
}