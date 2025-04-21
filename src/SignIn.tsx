import { SignIn } from '@clerk/react-router';
import AuthLayout from './AuthLayout';

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn signUpUrl="/sign-up" />
    </AuthLayout>
  );
}
