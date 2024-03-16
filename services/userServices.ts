import { User } from "../models/user";
import prisma from "../prisma";

export async function getUserById(id: number) {
  const resUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!resUser) {
    throw new Error("User not found");
  }

  const user: User = {
    id: resUser.id,
    email: resUser.email,
    name: resUser.name ?? "",
    role: resUser.role,
    saldo: resUser.saldo,
  };

  return user;
}

export async function getUsers() {
  const resUsers = await prisma.user.findMany();

  const users: User[] = resUsers.map((resUser) => {
    return {
      id: resUser.id,
      email: resUser.email,
      name: resUser.name ?? "",
      role: resUser.role,
      saldo: resUser.saldo,
    };
  });

  return users;
}
