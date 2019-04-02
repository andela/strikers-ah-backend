import bcrypt from 'bcryptjs';

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

export default {
  hashPassword, comparePassword
};
