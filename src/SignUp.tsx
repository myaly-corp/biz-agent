import { SignUp } from '@clerk/react-router';
import AuthLayout from './AuthLayout';

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp signInUrl="/sign-in" />
    </AuthLayout>
  );
}