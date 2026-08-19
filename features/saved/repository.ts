import { getDb, schema } from "@/lib/db";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import type { OpportunitySummary } from "@/features/opportunities/types";

/**
 * Check if a specific opportunity is saved by the user
 */
export async function isOpportunitySaved(
  userId: string,
  opportunityId: string
): Promise<boolean> {
  if (!userId || !opportunityId) return false;

  try {
    const { db } = getDb();
    const rows = await db
      .select({ count: schema.savedOpportunities.opportunityId })
      .from(schema.savedOpportunities)
      .where(
        and(
          eq(schema.savedOpportunities.userId, userId),
          eq(schema.savedOpportunities.opportunityId, opportunityId)
        )
      )
      .limit(1);

    return rows.length > 0;
  } catch (error) {
    console.error("Error checking saved opportunity:", error);
    return false;
  }
}

/**
 * Fetch all saved opportunity IDs for a user
 */
export async function getSavedOpportunityIds(userId: string): Promise<string[]> {
  if (!userId) return [];

  try {
    const { db } = getDb();
    const rows = await db
      .select({ opportunityId: schema.savedOpportunities.opportunityId })
      .from(schema.savedOpportunities)
      .where(eq(schema.savedOpportunities.userId, userId));

    return rows.map((r) => r.opportunityId);
  } catch (error) {
    console.error("Error getting saved opportunity ids:", error);
    return [];
  }
}

/**
 * Save an opportunity for a user (idempotent / ignore duplicate)
 */
export async function saveOpportunity(
  userId: string,
  opportunityId: string
): Promise<boolean> {
  try {
    const { db } = getDb();

    // Check if already saved
    const exists = await isOpportunitySaved(userId, opportunityId);
    if (exists) {
      return true;
    }

    await db.insert(schema.savedOpportunities).values({
      userId,
      opportunityId,
      savedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error(`Error saving opportunity (${opportunityId}) for user (${userId}):`, error);
    throw error;
  }
}

/**
 * Remove saved opportunity
 */
export async function unsaveOpportunity(
  userId: string,
  opportunityId: string
): Promise<boolean> {
  try {
    const { db } = getDb();

    await db
      .delete(schema.savedOpportunities)
      .where(
        and(
          eq(schema.savedOpportunities.userId, userId),
          eq(schema.savedOpportunities.opportunityId, opportunityId)
        )
      );

    return true;
  } catch (error) {
    console.error(`Error unsaving opportunity (${opportunityId}) for user (${userId}):`, error);
    throw error;
  }
}

/**
 * Fetch all saved opportunities with details, sorted newest saved first
 */
export async function getSavedOpportunities(
  userId: string,
  searchQuery?: string
): Promise<(OpportunitySummary & { savedAt: Date })[]> {
  if (!userId) return [];

  try {
    const { db } = getDb();

    const savedRows = await db
      .select({
        savedAt: schema.savedOpportunities.savedAt,
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
        categoryId: schema.opportunities.categoryId,
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
      .from(schema.savedOpportunities)
      .innerJoin(
        schema.opportunities,
        eq(schema.savedOpportunities.opportunityId, schema.opportunities.id)
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
          eq(schema.savedOpportunities.userId, userId),
          searchQuery && searchQuery.trim().length > 0
            ? or(
                ilike(schema.opportunities.title, `%${searchQuery.trim()}%`),
                ilike(schema.opportunities.shortDescription, `%${searchQuery.trim()}%`)
              )
            : undefined
        )
      )
      .orderBy(desc(schema.savedOpportunities.savedAt));

    return savedRows.map((row) => ({
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
      savedAt: row.savedAt,
      category: row.categoryId
        ? {
            id: row.categoryId,
            name: row.categoryName || "Opportunity",
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
    }));
  } catch (error) {
    console.error("Error fetching saved opportunities:", error);
    return [];
  }
}
