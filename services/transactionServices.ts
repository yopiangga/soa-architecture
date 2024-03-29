import { Transaction } from "../models/transaction";
import prisma from "../prisma";

export async function getTransactions() {
  const resTransactions = await prisma.transaction.findMany({
    include: {
      sender: true,
      receiver: true,
    },
  });

  const transactions: Transaction[] = resTransactions.map((resTransaction) => {
    return {
      id: resTransaction.id,
      sender: {
        id: resTransaction.sender.id,
        email: resTransaction.sender.email,
        name: resTransaction.sender.name || "",
        saldo: resTransaction.sender.saldo,
        role: resTransaction.sender.role,
      },
      receiver: {
        id: resTransaction.receiver.id,
        email: resTransaction.receiver.email,
        name: resTransaction.receiver.name || "",
        saldo: resTransaction.receiver.saldo,
        role: resTransaction.receiver.role,
      },
      amount: resTransaction.amount,
      note: resTransaction.note ?? "",
      createdAt: resTransaction.createdAt,
      updatedAt: resTransaction.updatedAt,
    };
  });

  return transactions;
}

export async function createTransaction(
  sender: string,
  receiver: string,
  amount: number,
  note: string
) {
  const resSender = await prisma.user.findUnique({
    where: {
      email: sender,
    },
  });

  if (!resSender) {
    throw new Error("Sender not found");
  }

  const resReceiver = await prisma.user.findUnique({
    where: {
      email: receiver,
    },
  });

  if (!resReceiver) {
    throw new Error("Receiver not found");
  }

  if (resSender.saldo < amount) {
    throw new Error("Insufficient saldo");
  }

  const resTransaction = await prisma.transaction.create({
    data: {
      sender: {
        connect: {
          id: resSender.id,
        },
      },
      receiver: {
        connect: {
          id: resReceiver.id,
        },
      },
      amount,
      note,
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  await prisma.user.update({
    where: {
      id: resSender.id,
    },
    data: {
      saldo: resSender.saldo - amount,
    },
  });

  await prisma.user.update({
    where: {
      id: resReceiver.id,
    },
    data: {
      saldo: resReceiver.saldo + amount,
    },
  });

  const transaction: Transaction = {
    id: resTransaction.id,
    sender: {
      id: resTransaction.sender.id,
      email: resTransaction.sender.email,
      name: resTransaction.sender.name || "",
      saldo: resTransaction.sender.saldo,
      role: resTransaction.sender.role,
    },
    receiver: {
      id: resTransaction.receiver.id,
      email: resTransaction.receiver.email,
      name: resTransaction.receiver.name || "",
      saldo: resTransaction.receiver.saldo,
      role: resTransaction.receiver.role,
    },
    amount: resTransaction.amount,
    note: resTransaction.note ?? "",
    createdAt: resTransaction.createdAt,
    updatedAt: resTransaction.updatedAt,
  };

  return transaction;
}

export async function deleteTransaction(id: number) {
  const resTransaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!resTransaction) {
    throw new Error("Transaction not found");
  }

  await prisma.transaction.delete({
    where: {
      id,
    },
  });

  const transaction: Transaction = {
    id: resTransaction.id,
    sender: {
      id: resTransaction.sender.id,
      email: resTransaction.sender.email,
      name: resTransaction.sender.name || "",
      saldo: resTransaction.sender.saldo,
      role: resTransaction.sender.role,
    },
    receiver: {
      id: resTransaction.receiver.id,
      email: resTransaction.receiver.email,
      name: resTransaction.receiver.name || "",
      saldo: resTransaction.receiver.saldo,
      role: resTransaction.receiver.role,
    },
    amount: resTransaction.amount,
    note: resTransaction.note ?? "",
    createdAt: resTransaction.createdAt,
    updatedAt: resTransaction.updatedAt,
  };

  return transaction;
}

export async function getTransactionById(id: number) {
  const resTransaction = await prisma.transaction.findUnique({
    where: {
      id
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!resTransaction) {
    throw new Error("Transaction not found");
  }

  const transaction: Transaction = {
    id: resTransaction.id,
    sender: {
      id: resTransaction.sender.id,
      email: resTransaction.sender.email,
      name: resTransaction.sender.name || "",
      saldo: resTransaction.sender.saldo,
      role: resTransaction.sender.role,
    },
    receiver: {
      id: resTransaction.receiver.id,
      email: resTransaction.receiver.email,
      name: resTransaction.receiver.name || "",
      saldo: resTransaction.receiver.saldo,
      role: resTransaction.receiver.role,
    },
    amount: resTransaction.amount,
    note: resTransaction.note ?? "",
    createdAt: resTransaction.createdAt,
    updatedAt: resTransaction.updatedAt,
  };

  return transaction;
}

export async function getTransactionsByUserEmail(email: string) {
  const resTransactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          sender: {
            email,
          }
        },
        {
          receiver: {
            email
          }
        },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  const transactions: Transaction[] = resTransactions.map((resTransaction) => {
    return {
      id: resTransaction.id,
      sender: {
        id: resTransaction.sender.id,
        email: resTransaction.sender.email,
        name: resTransaction.sender.name || "",
        saldo: resTransaction.sender.saldo,
        role: resTransaction.sender.role,
      },
      receiver: {
        id: resTransaction.receiver.id,
        email: resTransaction.receiver.email,
        name: resTransaction.receiver.name || "",
        saldo: resTransaction.receiver.saldo,
        role: resTransaction.receiver.role,
      },
      amount: resTransaction.amount,
      note: resTransaction.note ?? "",
      createdAt: resTransaction.createdAt,
      updatedAt: resTransaction.updatedAt,
    };
  });

  return transactions;
}
