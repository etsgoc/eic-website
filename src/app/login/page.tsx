import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="container-content flex min-h-[70vh] items-center py-16">
      <div className="mx-auto w-full max-w-sm">
        <p className="text-sm font-medium text-ink-500">Member login</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">
          Welcome back
        </h1>
        <p className="mt-2 text-[15px] text-ink-500">
          Log in to reach the member area once your EIC account is set up.
        </p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
