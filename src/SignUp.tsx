import { SignedOut, SignUp } from '@clerk/react-router'

export default function SignUpPage() {
  return (
    <div className="min-w-screen flex justify-around items-center h-screen">
      <div>
        <img src="/logo/myaly-logo.png" width={600} height={600} />
      </div>
      <SignUp signInUrl='sign-in' />
    </div>
  );
}
