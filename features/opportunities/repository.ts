import { getDb, schema } from "@/lib/db";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  sql,
} from "drizzle-orm";
import type {
  CategoryWithCount,
  OpportunityDetail,
  OpportunityFilterParams,
  OpportunitySummary,
  PaginatedOpportunities,
} from "./types";

/**
 * Fetch all active categories ordered by displayOrder
 */
export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const { db } = getDb();
    const rows = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.isActive, true))
      .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));

    return rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Helper to build the joined opportunity summary select
 */
function getOpportunitySelectFields() {
  return {
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
  };
}

interface RawOpportunityRow {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;
  registrationUrl: string | null;
  sourceUrl: string | null;
  mode: string | null;
  countryCode: string | null;
  city: string | null;
  venue: string | null;
  startAt: Date | null;
  endAt: Date | null;
  deadlineAt: Date | null;
  feeAmount: string;
  currency: string;
  isFree: boolean | null;
  status: string;
  verified: boolean;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryIcon: string | null;
  orgId: string | null;
  orgName: string | null;
  orgSlug: string | null;
  orgLogoUrl: string | null;
  orgVerified: boolean | null;
  orgCity: string | null;
  orgCountryCode: string | null;
}

/**
 * Map raw row to OpportunitySummary
 */
function mapToOpportunitySummary(row: RawOpportunityRow): OpportunitySummary {
  return {
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
  };
}

/**
 * Fetch featured opportunities for the Home page
 */
export async function getFeaturedOpportunities(
  limit: number = 6
): Promise<OpportunitySummary[]> {
  try {
    const { db } = getDb();

    // 1. Try fetching featured + published
    const featuredRows = await db
      .select(getOpportunitySelectFields())
      .from(schema.opportunities)
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
          eq(schema.opportunities.status, "published"),
          eq(schema.opportunities.featured, true)
        )
      )
      .orderBy(
        asc(schema.opportunities.deadlineAt),
        desc(schema.opportunities.publishedAt)
      )
      .limit(limit);

    if (featuredRows.length >= limit) {
      return featuredRows.map(mapToOpportunitySummary);
    }

    // 2. Fallback to recent published opportunities to fill up to limit
    const excludeIds = featuredRows.map((r) => r.id);
    const needed = limit - featuredRows.length;

    const fallbackQuery = db
      .select(getOpportunitySelectFields())
      .from(schema.opportunities)
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
          eq(schema.opportunities.status, "published"),
          excludeIds.length > 0
            ? sql`${schema.opportunities.id} NOT IN (${sql.join(
                excludeIds.map((id) => sql`${id}`),
                sql`, `
              )})`
            : undefined
        )
      )
      .orderBy(
        desc(schema.opportunities.publishedAt),
        desc(schema.opportunities.createdAt)
      )
      .limit(needed);

    const fallbackRows = await fallbackQuery;
    const combined = [...featuredRows, ...fallbackRows];
    return combined.map(mapToOpportunitySummary);
  } catch (error) {
    console.error("Error fetching featured opportunities:", error);
    return [];
  }
}

/**
 * Search and filter opportunities with pagination
 */
export async function searchOpportunities(
  params: OpportunityFilterParams
): Promise<PaginatedOpportunities> {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
  const offset = (page - 1) * limit;

  try {
    const { db } = getDb();
    const conditions = [eq(schema.opportunities.status, "published")];

    // 1. Text Search (title, shortDescription, description)
    if (params.q && params.q.trim().length > 0) {
      const term = `%${params.q.trim()}%`;
      conditions.push(
        or(
          ilike(schema.opportunities.title, term),
          ilike(schema.opportunities.shortDescription, term),
          ilike(schema.opportunities.description, term)
        )!
      );
    }

    // 2. Category Filter (by category slug)
    if (params.category && params.category !== "all") {
      conditions.push(eq(schema.categories.slug, params.category));
    }

    // 3. Mode Filter
    if (params.mode && params.mode !== "all") {
      conditions.push(eq(schema.opportunities.mode, params.mode));
    }

    // 4. Price Filter
    if (params.price === "free") {
      conditions.push(
        or(
          eq(schema.opportunities.isFree, true),
          eq(schema.opportunities.feeAmount, "0")
        )!
      );
    } else if (params.price === "paid") {
      conditions.push(
        and(
          eq(schema.opportunities.isFree, false),
          sql`${schema.opportunities.feeAmount} > 0`
        )!
      );
    }

    // 5. Deadline Filter
    const now = new Date();
    if (params.deadline === "this_week") {
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      conditions.push(
        and(
          gte(schema.opportunities.deadlineAt, now),
          lte(schema.opportunities.deadlineAt, in7Days)
        )!
      );
    } else if (params.deadline === "this_month") {
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      conditions.push(
        and(
          gte(schema.opportunities.deadlineAt, now),
          lte(schema.opportunities.deadlineAt, in30Days)
        )!
      );
    } else if (params.deadline === "next_3_months") {
      const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      conditions.push(
        and(
          gte(schema.opportunities.deadlineAt, now),
          lte(schema.opportunities.deadlineAt, in90Days)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Dynamic Ordering
    let orderByClause;
    if (params.sort === "newest") {
      orderByClause = [
        desc(schema.opportunities.publishedAt),
        desc(schema.opportunities.createdAt),
      ];
    } else if (params.sort === "deadline_soon") {
      orderByClause = [
        sql`${schema.opportunities.deadlineAt} ASC NULLS LAST`,
        desc(schema.opportunities.createdAt),
      ];
    } else if (params.sort === "alphabetical") {
      orderByClause = [asc(schema.opportunities.title)];
    } else {
      // Relevance / Default: Featured first, then upcoming deadline, then latest published
      orderByClause = [
        desc(schema.opportunities.featured),
        sql`${schema.opportunities.deadlineAt} ASC NULLS LAST`,
        desc(schema.opportunities.publishedAt),
      ];
    }

    // Total Count Query
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.opportunities)
      .leftJoin(
        schema.categories,
        eq(schema.opportunities.categoryId, schema.categories.id)
      )
      .where(whereClause);

    const total = countResult[0]?.count ?? 0;

    // Items Query
    const rows = await db
      .select(getOpportunitySelectFields())
      .from(schema.opportunities)
      .leftJoin(
        schema.categories,
        eq(schema.opportunities.categoryId, schema.categories.id)
      )
      .leftJoin(
        schema.organizations,
        eq(schema.opportunities.organizationId, schema.organizations.id)
      )
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    const items = rows.map(mapToOpportunitySummary);
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error searching opportunities:", error);
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

/**
 * Fetch complete Opportunity detail by Slug
 */
export async function getOpportunityBySlug(
  slug: string
): Promise<OpportunityDetail | null> {
  if (!slug) return null;

  try {
    const { db } = getDb();

    // 1. Fetch base opportunity with category and organization
    const rows = await db
      .select({
        ...getOpportunitySelectFields(),
        maxParticipants: schema.opportunities.maxParticipants,
        teamMinSize: schema.opportunities.teamMinSize,
        teamMaxSize: schema.opportunities.teamMaxSize,
        orgDescription: schema.organizations.description,
        orgWebsiteUrl: schema.organizations.websiteUrl,
        orgContactEmail: schema.organizations.contactEmail,
        orgType: schema.organizations.organizationType,
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
      .where(eq(schema.opportunities.slug, slug))
      .limit(1);

    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const opportunityId = row.id;

    // 2. Fetch associated relations in parallel
    const [
      benefits,
      eligibility,
      requirements,
      documents,
      skillsResult,
      tagsResult,
    ] = await Promise.all([
      db
        .select()
        .from(schema.opportunityBenefits)
        .where(eq(schema.opportunityBenefits.opportunityId, opportunityId))
        .orderBy(asc(schema.opportunityBenefits.sortOrder)),
      db
        .select()
        .from(schema.opportunityEligibility)
        .where(eq(schema.opportunityEligibility.opportunityId, opportunityId))
        .orderBy(asc(schema.opportunityEligibility.sortOrder)),
      db
        .select()
        .from(schema.opportunityRequirements)
        .where(eq(schema.opportunityRequirements.opportunityId, opportunityId))
        .orderBy(asc(schema.opportunityRequirements.sortOrder)),
      db
        .select()
        .from(schema.opportunityDocuments)
        .where(eq(schema.opportunityDocuments.opportunityId, opportunityId)),
      db
        .select({
          importance: schema.opportunitySkills.importance,
          required: schema.opportunitySkills.required,
          skill: schema.skills,
        })
        .from(schema.opportunitySkills)
        .innerJoin(
          schema.skills,
          eq(schema.opportunitySkills.skillId, schema.skills.id)
        )
        .where(eq(schema.opportunitySkills.opportunityId, opportunityId)),
      db
        .select({
          tag: schema.tags,
        })
        .from(schema.opportunityTags)
        .innerJoin(
          schema.tags,
          eq(schema.opportunityTags.tagId, schema.tags.id)
        )
        .where(eq(schema.opportunityTags.opportunityId, opportunityId)),
    ]);

    const summary = mapToOpportunitySummary(row);

    return {
      ...summary,
      maxParticipants: row.maxParticipants,
      teamMinSize: row.teamMinSize,
      teamMaxSize: row.teamMaxSize,
      benefits,
      eligibility,
      requirements,
      documents,
      skills: skillsResult.map((s) => ({
        skill: s.skill,
        importance: s.importance,
        required: s.required,
      })),
      tags: tagsResult.map((t) => t.tag),
      organizationDetail: row.orgId
        ? {
            id: row.orgId,
            name: row.orgName || "Organization",
            slug: row.orgSlug || "",
            organizationType: row.orgType || "company",
            description: row.orgDescription,
            logoUrl: row.orgLogoUrl,
            websiteUrl: row.orgWebsiteUrl,
            contactEmail: row.orgContactEmail,
            countryCode: row.orgCountryCode,
            city: row.orgCity,
            verified: row.orgVerified || false,
            verifiedAt: null,
            verifiedBy: null,
            createdBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        : null,
    };
  } catch (error) {
    console.error(`Error fetching opportunity by slug (${slug}):`, error);
    return null;
  }
}
