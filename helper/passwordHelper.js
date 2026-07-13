import bcrypt from 'bcrypt';

// Hash Password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Match Password
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
