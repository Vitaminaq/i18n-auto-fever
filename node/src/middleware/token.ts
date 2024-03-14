import jwt from "jsonwebtoken";
import express from "express";
import { scret } from "../config";

export const decodeToken = (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const { token } = req.cookies;

  if (!token) return res.unLogin("没有token");

  jwt.verify(token, scret, (err: any) => {
    if (err) return res.unLogin("token 信息错误");
    return next();
  })
};
