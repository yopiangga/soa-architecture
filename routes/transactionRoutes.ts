import express, { Request, Response } from "express";
export const router = express.Router();
import {
  getTransactionById,
  getTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionsByUserEmail,
} from "../services/transactionServices";
import { jwtAuthAdminMiddleware } from "../middleware/jwtAuthAdmin";

router.get("/", jwtAuthAdminMiddleware, async (req, res, next) => {
  try {
    const transactions = await getTransactions();

    res.json({
      message: "Get transactions success",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", jwtAuthAdminMiddleware, async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const transaction = await getTransactionById(id);

    res.json({
      message: "Get transaction success",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", jwtAuthAdminMiddleware, async (req, res, next) => {
  const { sender, receiver, amount, note } = req.body;

  try {
    const transaction = await createTransaction(
      sender,
      receiver,
      amount,
      note
    );

    res.json({
      message: "Create transaction success",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/user", async (req, res, next) => {
  const { receiver, amount, note } = req.body;
  const jwtUser = (req as any).user;

  try {
    const transaction = await createTransaction(
      jwtUser.email,
      receiver,
      amount,
      note
    );

    res.json({
      message: "Create transaction success",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", jwtAuthAdminMiddleware, async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    await deleteTransaction(id);

    res.json({
      message: "Delete transaction success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user/me", async (req, res, next) => {
  const jwtUser = (req as any).user;

  try {
    const transactions = await getTransactionsByUserEmail(jwtUser.email);

    res.json({
      message: "Get transactions by user id success",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:email", async (req, res, next) => {
  const email = req.params?.email ?? "";

  try {
    const transactions = await getTransactionsByUserEmail(email);
    res.json({
      message: "Get transactions by user email success",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
});
