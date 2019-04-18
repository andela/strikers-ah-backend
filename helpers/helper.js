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
  const token = jwt.sign(user, process.env.secretKey, { expiresIn: '1 day' });
  return token;
};
const handleUsed = (emailUsed, userNameUsed) => {
  if (emailUsed && userNameUsed) {
    return 'Both email and username are in use';
  }
  if (emailUsed) {
    return 'email is already in use';
  }
  if (userNameUsed) {
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

const authenticationResponse = (res, token, userData) => res.header('x-auth-token', token).status(200).json({
  user: {
    ...userData,
    token
  }
});

const uploadImage = async req => new Promise((resolve, reject) => {
  let fileName = '';
  if (req.files) {
    const avatarIMage = req.files.image;
    fileName = `images/profile-images/${(new Date()).getTime()}-${avatarIMage.name}`;
    avatarIMage.mv(fileName, (error) => {
      if (error) {
        reject(new Error('The intended Image was not uploaded'));
      }
    });
  }
  resolve(fileName);
});
const asyncHandler = callBackFunction => async (req, res, next) => {
  try {
    await callBackFunction(req, res, next);
  } catch (error) {
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : 500;
    res.status(statusCode).json({
      error
    });
  }
};
const decodeToken = req => jwt.verify(req.header('x-auth-token'), process.env.SECRETKEY);
export default {
  hashPassword,
  comparePassword,
  generateToken,
  handleUsed,
  validatePassword,
  authenticationResponse,
  decodeToken,
  uploadImage,
  asyncHandler
};
