import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
// compare password
const comparePassword = async (password, hashedPassword) => {
  const comparison = await bcrypt.compare(password, hashedPassword);
  return comparison;
};

const generateToken = (user) => {
  const token = jwt.sign(user, process.env.secretKey);
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};
export default {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};
