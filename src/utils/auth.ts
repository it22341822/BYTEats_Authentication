import jwt, {SignOptions} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET : string = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN : string | number = process.env.JWT_EXPIRES_IN || "1d";

// Hash Password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare Passwords
export const comparePasswords = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT Token
export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};

// Verify Token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};