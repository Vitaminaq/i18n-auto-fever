import express, { Express } from "express";
import { i18nRouter } from "./i18n";
import { userRouter } from "./user";

const router = express.Router();

export const initRouter = (app: Express) => {
    app.use('/api/i18n', i18nRouter(router));
    app.use('/api/user', userRouter(router));
}