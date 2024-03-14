import { Router } from "express";
import { login } from "../controler/user";

export const userRouter = (router: Router) => {
  router.post("/login", login);

  return router;
};
