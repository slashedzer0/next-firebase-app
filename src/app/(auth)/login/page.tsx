import { LoginForm } from "@/components/form-login"
import { Branding } from "@/components/branding"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Branding />
        <LoginForm />
      </div>
    </div>
  )
}
