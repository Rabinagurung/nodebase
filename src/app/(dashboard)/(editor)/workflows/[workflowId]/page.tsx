import { requireAuth } from "@/lib/auth-utils";

interface WorkflowDetailsProps{
    params: Promise<{workflowId: string}>
    
}

const Page = async({params}: WorkflowDetailsProps) => {
    await requireAuth();

    const {workflowId} = await params;
    
return (
    <div>Workflow Id {workflowId}</div>
  )
}

export default Page;