import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    return error;
  }
};
// compare password
const comparePassword = async (password, hashedPassword) => {
  try {
    const comparison = await bcrypt.compare(password, hashedPassword);
    return comparison;
  } catch (error) {
    return error;
  }
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
    return error;
  }
};
export default {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};
