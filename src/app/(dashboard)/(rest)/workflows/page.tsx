import { requireAuth } from "@/lib/auth-utils"

const Page = async() => {
  await requireAuth();

  return (
    <p>WorkFlow page</p>
  )
}

export default Page