import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const hashPassword = (password) => {
  try {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    return false;
  }
};
// compare password
const comparePassword = (password, hashedPassword) => {
  try {
    return (bcrypt.compareSync(password, hashedPassword));
  } catch (error) {
    return false;
  }
};

const generateToken = (user) => {
  const token = jwt.sign(user, process.env.SECRETKEY);
  return token;
};
const handleUsed = (emailUsed, userNameUsed) => {
  if (emailUsed && userNameUsed) {
    return 'Both email and username are in use';
  } if (emailUsed) {
    return 'email is already in use';
  } if (userNameUsed) {
    return 'username is not available';
  }
  return true;
};
export default {
  hashPassword,
  comparePassword,
  generateToken,
  handleUsed
};
