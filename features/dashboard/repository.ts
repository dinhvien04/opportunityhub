import { getDb, schema } from "@/lib/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getUserApplications } from "@/features/applications/repository";
import { getSavedOpportunities } from "@/features/saved/repository";
import { getUserProfileComplete } from "@/features/profile/repository";
import type { ApplicationWithOpportunity } from "@/features/applications/types";
import type { OpportunitySummary } from "@/features/opportunities/types";
import type { UserProfileComplete } from "@/features/profile/types";

export interface DashboardSummary {
  profile: UserProfileComplete | null;
  stats: {
    totalSaved: number;
    activeApplications: number;
    completedApplications: number;
    upcomingDeadlinesCount: number;
  };
  recentApplications: ApplicationWithOpportunity[];
  savedOpportunities: (OpportunitySummary & { savedAt: Date })[];
  upcomingDeadlineApplications: ApplicationWithOpportunity[];
  recommendedOpportunities: OpportunitySummary[];
}

export async function getDashboardData(
  userId: string
): Promise<DashboardSummary | null> {
  if (!userId) return null;

  try {
    const { db } = getDb();

    // 1. Fetch Profile
    const profile = await getUserProfileComplete(userId);

    // 2. Fetch User Applications
    const allApplications = await getUserApplications(userId);

    // 3. Fetch Saved Opportunities
    const savedList = await getSavedOpportunities(userId);

    // 4. Calculate Stats
    const activeStatuses = [
      "interested",
      "preparing",
      "submitted",
      "reviewing",
      "interview",
      "waitlisted",
    ];
    const completedStatuses = ["accepted", "rejected", "withdrawn"];

    const activeApps = allApplications.filter((a) =>
      activeStatuses.includes(a.status)
    );
    const completedApps = allApplications.filter((a) =>
      completedStatuses.includes(a.status)
    );

    const now = new Date();
    const upcomingDeadlines = allApplications.filter((a) => {
      if (!a.opportunity.deadlineAt) return false;
      const deadline = new Date(a.opportunity.deadlineAt);
      return deadline > now;
    });

    // 5. Fetch recommended opportunities matching user interests or featured ones
    const recommended: OpportunitySummary[] = [];
    const interestIds = profile?.interests.map((i) => i.interestId) || [];

    if (interestIds.length > 0) {
      const matchedOpps = await db
        .select({
          id: schema.opportunities.id,
          title: schema.opportunities.title,
          slug: schema.opportunities.slug,
          shortDescription: schema.opportunities.shortDescription,
          description: schema.opportunities.description,
          coverImageUrl: schema.opportunities.coverImageUrl,
          registrationUrl: schema.opportunities.registrationUrl,
          sourceUrl: schema.opportunities.sourceUrl,
          mode: schema.opportunities.mode,
          countryCode: schema.opportunities.countryCode,
          city: schema.opportunities.city,
          venue: schema.opportunities.venue,
          startAt: schema.opportunities.startAt,
          endAt: schema.opportunities.endAt,
          deadlineAt: schema.opportunities.deadlineAt,
          feeAmount: schema.opportunities.feeAmount,
          currency: schema.opportunities.currency,
          isFree: schema.opportunities.isFree,
          status: schema.opportunities.status,
          verified: schema.opportunities.verified,
          featured: schema.opportunities.featured,
          publishedAt: schema.opportunities.publishedAt,
          createdAt: schema.opportunities.createdAt,
          categoryId: schema.categories.id,
          categoryName: schema.categories.name,
          categorySlug: schema.categories.slug,
          categoryIcon: schema.categories.icon,
          orgId: schema.organizations.id,
          orgName: schema.organizations.name,
          orgSlug: schema.organizations.slug,
          orgLogoUrl: schema.organizations.logoUrl,
          orgVerified: schema.organizations.verified,
          orgCity: schema.organizations.city,
          orgCountryCode: schema.organizations.countryCode,
        })
        .from(schema.opportunityInterests)
        .innerJoin(
          schema.opportunities,
          eq(schema.opportunityInterests.opportunityId, schema.opportunities.id)
        )
        .leftJoin(
          schema.categories,
          eq(schema.opportunities.categoryId, schema.categories.id)
        )
        .leftJoin(
          schema.organizations,
          eq(schema.opportunities.organizationId, schema.organizations.id)
        )
        .where(
          and(
            inArray(schema.opportunityInterests.interestId, interestIds),
            eq(schema.opportunities.status, "published")
          )
        )
        .limit(6);

      // Deduplicate by ID
      const seen = new Set<string>();
      for (const row of matchedOpps) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          recommended.push({
            id: row.id,
            title: row.title,
            slug: row.slug,
            shortDescription: row.shortDescription,
            description: row.description,
            coverImageUrl: row.coverImageUrl,
            registrationUrl: row.registrationUrl,
            sourceUrl: row.sourceUrl,
            mode: row.mode,
            countryCode: row.countryCode,
            city: row.city,
            venue: row.venue,
            startAt: row.startAt,
            endAt: row.endAt,
            deadlineAt: row.deadlineAt,
            feeAmount: row.feeAmount,
            currency: row.currency,
            isFree: row.isFree,
            status: row.status,
            verified: row.verified,
            featured: row.featured,
            publishedAt: row.publishedAt,
            createdAt: row.createdAt,
            category: row.categoryId
              ? {
                  id: row.categoryId,
                  name: row.categoryName || "General",
                  slug: row.categorySlug || "all",
                  icon: row.categoryIcon || null,
                }
              : null,
            organization: row.orgId
              ? {
                  id: row.orgId,
                  name: row.orgName || "Organization",
                  slug: row.orgSlug || "",
                  logoUrl: row.orgLogoUrl,
                  verified: row.orgVerified || false,
                  city: row.orgCity,
                  countryCode: row.orgCountryCode,
                }
              : null,
          });
        }
      }
    }

    // If fewer than 4 recommended, fill with featured or recent published opportunities
    if (recommended.length < 4) {
      const genericOpps = await db
        .select({
          id: schema.opportunities.id,
          title: schema.opportunities.title,
          slug: schema.opportunities.slug,
          shortDescription: schema.opportunities.shortDescription,
          description: schema.opportunities.description,
          coverImageUrl: schema.opportunities.coverImageUrl,
          registrationUrl: schema.opportunities.registrationUrl,
          sourceUrl: schema.opportunities.sourceUrl,
          mode: schema.opportunities.mode,
          countryCode: schema.opportunities.countryCode,
          city: schema.opportunities.city,
          venue: schema.opportunities.venue,
          startAt: schema.opportunities.startAt,
          endAt: schema.opportunities.endAt,
          deadlineAt: schema.opportunities.deadlineAt,
          feeAmount: schema.opportunities.feeAmount,
          currency: schema.opportunities.currency,
          isFree: schema.opportunities.isFree,
          status: schema.opportunities.status,
          verified: schema.opportunities.verified,
          featured: schema.opportunities.featured,
          publishedAt: schema.opportunities.publishedAt,
          createdAt: schema.opportunities.createdAt,
          categoryId: schema.categories.id,
          categoryName: schema.categories.name,
          categorySlug: schema.categories.slug,
          categoryIcon: schema.categories.icon,
          orgId: schema.organizations.id,
          orgName: schema.organizations.name,
          orgSlug: schema.organizations.slug,
          orgLogoUrl: schema.organizations.logoUrl,
          orgVerified: schema.organizations.verified,
          orgCity: schema.organizations.city,
          orgCountryCode: schema.organizations.countryCode,
        })
        .from(schema.opportunities)
        .leftJoin(
          schema.categories,
          eq(schema.opportunities.categoryId, schema.categories.id)
        )
        .leftJoin(
          schema.organizations,
          eq(schema.opportunities.organizationId, schema.organizations.id)
        )
        .where(eq(schema.opportunities.status, "published"))
        .orderBy(desc(schema.opportunities.featured), desc(schema.opportunities.createdAt))
        .limit(6);

      for (const row of genericOpps) {
        if (!recommended.some((r) => r.id === row.id)) {
          recommended.push({
            id: row.id,
            title: row.title,
            slug: row.slug,
            shortDescription: row.shortDescription,
            description: row.description,
            coverImageUrl: row.coverImageUrl,
            registrationUrl: row.registrationUrl,
            sourceUrl: row.sourceUrl,
            mode: row.mode,
            countryCode: row.countryCode,
            city: row.city,
            venue: row.venue,
            startAt: row.startAt,
            endAt: row.endAt,
            deadlineAt: row.deadlineAt,
            feeAmount: row.feeAmount,
            currency: row.currency,
            isFree: row.isFree,
            status: row.status,
            verified: row.verified,
            featured: row.featured,
            publishedAt: row.publishedAt,
            createdAt: row.createdAt,
            category: row.categoryId
              ? {
                  id: row.categoryId,
                  name: row.categoryName || "General",
                  slug: row.categorySlug || "all",
                  icon: row.categoryIcon || null,
                }
              : null,
            organization: row.orgId
              ? {
                  id: row.orgId,
                  name: row.orgName || "Organization",
                  slug: row.orgSlug || "",
                  logoUrl: row.orgLogoUrl,
                  verified: row.orgVerified || false,
                  city: row.orgCity,
                  countryCode: row.orgCountryCode,
                }
              : null,
          });
        }
      }
    }

    return {
      profile,
      stats: {
        totalSaved: savedList.length,
        activeApplications: activeApps.length,
        completedApplications: completedApps.length,
        upcomingDeadlinesCount: upcomingDeadlines.length,
      },
      recentApplications: allApplications.slice(0, 5),
      savedOpportunities: savedList.slice(0, 4),
      upcomingDeadlineApplications: upcomingDeadlines.slice(0, 4),
      recommendedOpportunities: recommended.slice(0, 4),
    };
  } catch (error) {
    console.error(`Error fetching dashboard data for user (${userId}):`, error);
    return null;
  }
}
