import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        forceRedirectUrl="http://localhost:3000/auth-redirect"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-xl',
          }
        }}
      />
    </div>
  );
}
