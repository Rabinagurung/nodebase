import { inngest } from "@/inngest/client";
import {  createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";


export const appRouter = createTRPCRouter({
    
    testAI: protectedProcedure.mutation(async()=>{
      await inngest.send({
        name: "execute/ai", 
      })

      return { success: true, message: "Job queued for executing AI"}
    }),
    getWorkflows: protectedProcedure.query(({ctx}) => {
        return prisma.workflow.findMany();
    }),
    createWorkFlow: protectedProcedure.mutation(async() => {
        await inngest.send({
            name: "test/hello.world", 
            data: {
                email: "anish@gmail.com"
            }
        })        

       return { success: true, message: "Job queued for executing test flow"}
    }),
}); 

//export type definition of API
export type AppRouter = typeof appRouter;