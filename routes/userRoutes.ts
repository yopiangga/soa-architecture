import express, { Request, Response } from "express";
export const router = express.Router();
import { getUsers, getUserById } from "../services/userServices";
import { jwtAuthAdminMiddleware } from "../middleware/jwtAuthAdmin";

router.get("/", jwtAuthAdminMiddleware, async (req, res, next) => {
  try {
    const users = await getUsers();

    res.json({
      message: "Get users success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  const jwtUser = (req as any).user;

  try {
    const user = await getUserById(parseInt(jwtUser.id));

    res.json({
      message: "Get user success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", jwtAuthAdminMiddleware, async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const user = await getUserById(id);

    res.json({
      message: "Get user success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
