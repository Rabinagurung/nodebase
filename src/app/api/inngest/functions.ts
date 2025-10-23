import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";


export const helloWorld = inngest.createFunction(
    { id: "hello-world", retries: 5}, 
    { event: "test/hello.world" }, 
    async ({event, step}) => {
        //fetch youtube video 
        await step.sleep("fetching", "5s");
        //transcribe video
        await step.sleep("transcribing", "5s");
        //use openAI for summary
        await step.sleep("sending-to-ai", "5s");

        //then create workflow  in prisma using mutation
        await step.run("create-workflow", () =>{
            return prisma.workflow.create({
                data: {
                    name: "workflow-from-inngest"
                }
            })
        })

    }
)