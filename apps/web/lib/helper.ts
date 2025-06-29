import bcrypt from 'bcrypt';

const convertToIST = (utcDate: Date | undefined) => {
  if (!utcDate) return;
  const date = new Date(utcDate);
  const istTime = new Date(date.getTime());
  return istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
};

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

function artificialDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { hashPassword, comparePassword, convertToIST, artificialDelay };
