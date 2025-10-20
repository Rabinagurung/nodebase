import { PrismaClient } from "@/generated/prisma";

//prisma property added to global object
const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
}

const prisma = globalForPrisma.prisma || new PrismaClient(); 

if(process.env.NODE_ENV !== "production" ) {
    globalForPrisma.prisma = prisma
}

export default prisma;

/* Hot reload is tracking all changes, and it will create prisma instances multiple times and we will get warnings in terminal. 
Development can be slow and bugs can appear. 
So hack is used.   
global is never affected by hot reload and stored prisma client inisde global.prisma prop. 
This makes sure new instances of prisma not created during hot reload only in development. 
In production, const prisma = new PrismaClient(); this happens
*/