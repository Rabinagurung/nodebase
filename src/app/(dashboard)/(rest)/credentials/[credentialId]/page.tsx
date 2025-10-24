import { requireAuth } from "@/lib/auth-utils";

interface CredentialDetailsProps{
    params: Promise<{credentialId: string}>
    
}

const Page = async({params}: CredentialDetailsProps) => {
    await requireAuth();
    const {credentialId} = await params;

return (
    <div>Credential {credentialId}</div>
  )
}

export default Page