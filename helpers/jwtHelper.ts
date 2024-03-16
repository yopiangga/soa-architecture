import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function generateToken(id: String, email: String, role: String) {
  const token = jwt.sign({ id, email, role }, secret as string, { expiresIn: "1d" });
  return token;
}
