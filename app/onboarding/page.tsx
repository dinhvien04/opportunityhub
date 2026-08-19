import { requireUser } from "@/lib/auth/guards";
import { ProfileService } from "@/features/profile/service";
import { OnboardingWizard } from "@/features/profile/components/onboarding-wizard";

export const metadata = {
  title: "Onboarding - OpportunityHub",
  description: "Customize your profile and unlock opportunities matching your goals.",
};

export default async function OnboardingPage() {
  const user = await requireUser("/login?returnTo=/onboarding");

  // Fetch real skills and interests from Neon PostgreSQL
  const [allInterests, allSkills] = await Promise.all([
    ProfileService.getAllInterests(),
    ProfileService.getAllSkills(),
  ]);

  return (
    <div className="min-h-screen py-10">
      <OnboardingWizard
        user={user}
        interests={allInterests}
        skills={allSkills}
      />
    </div>
  );
}
