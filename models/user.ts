import { Role } from "@prisma/client";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  saldo: number;
}
