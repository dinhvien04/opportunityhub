import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign In - OpportunityHub",
  description: "Sign in to track applications, bookmark opportunities, and personalize your feed.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (user) {
    if (!user.onboardingCompleted) {
      redirect("/onboarding");
    }
    redirect(params.returnTo || "/dashboard");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <LoginForm returnTo={params.returnTo} />
      </div>
    </div>
  );
}
