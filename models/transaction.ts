import { User } from "./user";

export interface Transaction {
  id: number;
  sender: User;
  receiver: User;
  amount: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}
