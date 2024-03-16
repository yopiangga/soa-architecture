import express, { Request, Response } from "express";
export const router = express.Router();
import { signIn, signUp } from "../services/authServices";

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await signIn(email, password);

    res.json({
      message: "Sign in success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const user = await signUp(email, password, name);

    res.json({
      message: "Sign up success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
