import Image from 'next/image'
import Link from 'next/link'


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-6 md:p-10 bg-muted">
        <div className="flex flex-col w-full max-w-sm gap-6">
            <Link href="/" className="flex items-center gap-2 self-center font-medium">
                <Image alt="Nodebase" src="/logos/logo.svg" width={30} height={30}/>
                Nodebase
            </Link>
            {children}
        </div>
    </div>
  )
}

export default AuthLayout