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
const validatePassword = (password) => {
  let message = '';
  const hasCharacter = ['@', '*', '%', '^', '!', '~', '`', '"', '\''].some(r => password.includes(r));
  if (!hasCharacter) message += 'The password  should have at least one special character';
  if (!/(.*\d.*)/.test(password)) {
    message += 'The password Must contain at least one number';
  }
  if (!/(.*[a-z].*)/.test(password)) {
    message += 'The password must contain at least one lower case character';
  }
  if (!/(.*[A-Z].*)/.test(password)) {
    message += 'the password should contain at least one uppercase character';
  }
  if (password.length < 8) {
    message += 'password must not be less than 8 characters';
  }
  return (message === '') ? true : message;
};

const authenticationResponse = (res, token, userData) => res.header('x-auth-token', token).status(200).json({ user: { ...userData, token } });

export default {
  hashPassword,
  comparePassword,
  generateToken,
  handleUsed,
  validatePassword,
  authenticationResponse
};
