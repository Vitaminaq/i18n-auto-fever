import express from "express";
import jwt from "jsonwebtoken";
import { scret, tokens } from "../config";

export const login = (req: express.Request, res: express.Response) => {
    const { token } = req.body;

    if (!tokens.includes(token)) return res.fail("token错误");

    const newToken = jwt.sign({ token }, scret, { expiresIn: '1d' });

    res.cookie('token', newToken, { path: '/', sameSite: "none", secure: true, signed: false });

    res.success("登录成功");
}