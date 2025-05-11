import { PrismaClient } from './generated/prisma'; 

// Instantiate Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();


if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
// Optionally, you can also re-export all types and enums from Prisma Client
export * from './generated/prisma';