import prisma from "../prisma";
import { generateToken } from "../helpers/jwtHelper";
import { Role } from "@prisma/client";
import { User } from "../models/user";

export async function signIn(email: string, password: string) {
  const resUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!resUser) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = resUser.password === password;

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const user: User = {
    id: resUser.id,
    email: resUser.email,
    name: resUser.name ?? "",
    role: resUser.role,
    saldo: resUser.saldo,
  };

  const token = generateToken(
    user.id.toString(),
    user.email,
    user.role as Role
  );

  return {
    user,
    token,
  };
}

export async function signUp(email: string, password: string, name: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email has been registered");
  }

  const resUser = await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });

  if (!resUser) {
    throw new Error("Something went wrong");
  }

  const user: User = {
    id: resUser.id,
    email: resUser.email,
    name: resUser.name ?? "",
    role: resUser.role,
    saldo: resUser.saldo,
  };

  const token = generateToken(
    user.id.toString(),
    user.email,
    user.role as Role
  );

  return {
    user,
    token,
  };
}
