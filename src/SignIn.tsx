import { SignIn, SignInButton } from '@clerk/react-router'

export default function SignInPage() {
  return (
    <div className='min-w-screen  flex justify-around items-center h-screen'>
      <div>
        <img src="/logo/myaly-logo.png" width={600} height={600} />
      </div>
      <SignIn  path="/login"
              routing="path"
              redirectUrl="/" />

    </div>
  )
}