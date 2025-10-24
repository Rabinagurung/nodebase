import { requireAuth } from "@/lib/auth-utils";

interface ExecutionDetailsProps{
    params: Promise<{executionId: string}>
    
}

const Page = async({params}: ExecutionDetailsProps) => {
  await requireAuth();
  const {executionId} = await params;
  
  return (
    <div>Execution {executionId}</div>
  )
}

export default Page