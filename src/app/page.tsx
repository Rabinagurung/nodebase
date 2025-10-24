"use client";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const Page = () =>{

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions()); 
  
  const create = useMutation(trpc.createWorkFlow.mutationOptions({
    onSuccess: () =>{
      toast.success("Job queued");
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }));

  const testAI = useMutation(trpc.testAI.mutationOptions({
    onSuccess: () => {
      toast.success("AI job queued")
    }
  }))

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
      Procted server component
      <div>
        <p>
            {JSON.stringify(data, null, 2)}
        </p>
      
      </div>
       <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create workflow
       </Button>

       <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>Test AI</Button>
    </div>
  )
}

export default Page;