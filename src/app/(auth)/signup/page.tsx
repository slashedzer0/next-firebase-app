import { SignUpForm } from '@/app/(auth)/_components/form-signup';
import { Branding } from '@/components/branding';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Branding />
        <SignUpForm />
      </div>
    </div>
  );
}
