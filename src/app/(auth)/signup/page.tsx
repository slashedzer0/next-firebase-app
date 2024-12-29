import { SignUpForm } from "@/components/form-signup"
import { Branding } from "@/components/branding"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Branding />
        <SignUpForm />
      </div>
    </div>
  )
}

