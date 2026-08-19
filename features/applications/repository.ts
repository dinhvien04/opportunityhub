import { getDb, schema } from "@/lib/db";
import { and, asc, desc, eq } from "drizzle-orm";
import type {
  ApplicationChecklistItem,
} from "@/lib/db/schema";
import type { ApplicationStatus, ApplicationWithOpportunity } from "./types";

/**
 * Fetch all applications for a user, optionally filtered by status
 */
export async function getUserApplications(
  userId: string,
  statusFilter?: ApplicationStatus | "all"
): Promise<ApplicationWithOpportunity[]> {
  if (!userId) return [];

  try {
    const { db } = getDb();

    const appRows = await db
      .select({
        id: schema.applications.id,
        userId: schema.applications.userId,
        opportunityId: schema.applications.opportunityId,
        status: schema.applications.status,
        externalApplicationUrl: schema.applications.externalApplicationUrl,
        externalReference: schema.applications.externalReference,
        notes: schema.applications.notes,
        submittedAt: schema.applications.submittedAt,
        decisionAt: schema.applications.decisionAt,
        createdAt: schema.applications.createdAt,
        updatedAt: schema.applications.updatedAt,
        // Opportunity
        oppId: schema.opportunities.id,
        oppTitle: schema.opportunities.title,
        oppSlug: schema.opportunities.slug,
        oppShortDesc: schema.opportunities.shortDescription,
        oppDesc: schema.opportunities.description,
        oppCoverImg: schema.opportunities.coverImageUrl,
        oppRegUrl: schema.opportunities.registrationUrl,
        oppSourceUrl: schema.opportunities.sourceUrl,
        oppMode: schema.opportunities.mode,
        oppCountryCode: schema.opportunities.countryCode,
        oppCity: schema.opportunities.city,
        oppVenue: schema.opportunities.venue,
        oppStartAt: schema.opportunities.startAt,
        oppEndAt: schema.opportunities.endAt,
        oppDeadlineAt: schema.opportunities.deadlineAt,
        oppFeeAmount: schema.opportunities.feeAmount,
        oppCurrency: schema.opportunities.currency,
        oppIsFree: schema.opportunities.isFree,
        oppStatus: schema.opportunities.status,
        oppVerified: schema.opportunities.verified,
        oppFeatured: schema.opportunities.featured,
        oppPublishedAt: schema.opportunities.publishedAt,
        oppCreatedAt: schema.opportunities.createdAt,
        oppUpdatedAt: schema.opportunities.updatedAt,
        // Category
        catId: schema.categories.id,
        catName: schema.categories.name,
        catSlug: schema.categories.slug,
        catDesc: schema.categories.description,
        catIcon: schema.categories.icon,
        catOrder: schema.categories.displayOrder,
        catActive: schema.categories.isActive,
        catCreatedAt: schema.categories.createdAt,
        // Organization
        orgId: schema.organizations.id,
        orgName: schema.organizations.name,
        orgSlug: schema.organizations.slug,
        orgType: schema.organizations.organizationType,
        orgDesc: schema.organizations.description,
        orgLogo: schema.organizations.logoUrl,
        orgWeb: schema.organizations.websiteUrl,
        orgEmail: schema.organizations.contactEmail,
        orgCountry: schema.organizations.countryCode,
        orgCity: schema.organizations.city,
        orgVerified: schema.organizations.verified,
        orgCreatedAt: schema.organizations.createdAt,
        orgUpdatedAt: schema.organizations.updatedAt,
      })
      .from(schema.applications)
      .innerJoin(
        schema.opportunities,
        eq(schema.applications.opportunityId, schema.opportunities.id)
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
          eq(schema.applications.userId, userId),
          statusFilter && statusFilter !== "all"
            ? eq(schema.applications.status, statusFilter)
            : undefined
        )
      )
      .orderBy(desc(schema.applications.updatedAt));

    if (appRows.length === 0) {
      return [];
    }

    const applicationIds = appRows.map((a) => a.id);

    // Fetch checklist items for all returned applications
    const allChecklistItems = await db
      .select()
      .from(schema.applicationChecklistItems)
      .orderBy(asc(schema.applicationChecklistItems.sortOrder));

    const checklistMap = new Map<string, ApplicationChecklistItem[]>();
    for (const item of allChecklistItems) {
      if (applicationIds.includes(item.applicationId)) {
        const list = checklistMap.get(item.applicationId) || [];
        list.push(item);
        checklistMap.set(item.applicationId, list);
      }
    }

    return appRows.map((row) => {
      const items = checklistMap.get(row.id) || [];
      const totalItems = items.length;
      const completedItems = items.filter((i) => i.isCompleted).length;
      const progressPercent =
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      return {
        id: row.id,
        userId: row.userId,
        opportunityId: row.opportunityId,
        status: row.status as ApplicationStatus,
        externalApplicationUrl: row.externalApplicationUrl,
        externalReference: row.externalReference,
        notes: row.notes,
        submittedAt: row.submittedAt,
        decisionAt: row.decisionAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        opportunity: {
          id: row.oppId,
          organizationId: row.orgId || null,
          categoryId: row.catId || null,
          createdBy: null,
          title: row.oppTitle,
          slug: row.oppSlug,
          shortDescription: row.oppShortDesc,
          description: row.oppDesc,
          coverImageUrl: row.oppCoverImg,
          registrationUrl: row.oppRegUrl,
          sourceUrl: row.oppSourceUrl,
          mode: row.oppMode,
          countryCode: row.oppCountryCode,
          city: row.oppCity,
          venue: row.oppVenue,
          startAt: row.oppStartAt,
          endAt: row.oppEndAt,
          deadlineAt: row.oppDeadlineAt,
          feeAmount: row.oppFeeAmount,
          currency: row.oppCurrency,
          isFree: row.oppIsFree,
          maxParticipants: null,
          teamMinSize: null,
          teamMaxSize: null,
          status: row.oppStatus,
          verified: row.oppVerified,
          verifiedAt: null,
          verifiedBy: null,
          featured: row.oppFeatured,
          publishedAt: row.oppPublishedAt,
          createdAt: row.oppCreatedAt,
          updatedAt: row.oppUpdatedAt,
          category: row.catId
            ? {
                id: row.catId,
                name: row.catName || "General",
                slug: row.catSlug || "general",
                description: row.catDesc || null,
                icon: row.catIcon || null,
                displayOrder: row.catOrder ?? 0,
                isActive: row.catActive ?? true,
                createdAt: row.catCreatedAt || new Date(),
              }
            : null,
          organization: row.orgId
            ? {
                id: row.orgId,
                name: row.orgName || "Organization",
                slug: row.orgSlug || "org",
                organizationType: row.orgType || "other",
                description: row.orgDesc || null,
                logoUrl: row.orgLogo || null,
                websiteUrl: row.orgWeb || null,
                contactEmail: row.orgEmail || null,
                countryCode: row.orgCountry || null,
                city: row.orgCity || null,
                verified: row.orgVerified ?? false,
                verifiedAt: null,
                verifiedBy: null,
                createdBy: null,
                createdAt: row.orgCreatedAt || new Date(),
                updatedAt: row.orgUpdatedAt || new Date(),
              }
            : null,
        },
        checklistItems: items,
        totalItems,
        completedItems,
        progressPercent,
      };
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return [];
  }
}

/**
 * Fetch a single application by ID with all details & checklist items
 */
export async function getApplicationById(
  applicationId: string,
  userId: string
): Promise<ApplicationWithOpportunity | null> {
  if (!applicationId || !userId) return null;

  try {
    const list = await getUserApplications(userId);
    return list.find((a) => a.id === applicationId) || null;
  } catch (error) {
    console.error(`Error fetching application (${applicationId}):`, error);
    return null;
  }
}

/**
 * Check if user already has an application for an opportunity
 */
export async function getApplicationByOpportunity(
  userId: string,
  opportunityId: string
): Promise<ApplicationWithOpportunity | null> {
  if (!userId || !opportunityId) return null;

  try {
    const list = await getUserApplications(userId);
    return list.find((a) => a.opportunityId === opportunityId) || null;
  } catch (error) {
    console.error(`Error finding application for opp (${opportunityId}):`, error);
    return null;
  }
}

/**
 * Create a new application track for an opportunity with initial default checklist
 */
export async function createApplication(
  userId: string,
  opportunityId: string,
  status: ApplicationStatus = "preparing"
): Promise<string> {
  try {
    const { db } = getDb();

    // Check if application already exists
    const existing = await db
      .select({ id: schema.applications.id })
      .from(schema.applications)
      .where(
        and(
          eq(schema.applications.userId, userId),
          eq(schema.applications.opportunityId, opportunityId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Insert new application
    const [newApp] = await db
      .insert(schema.applications)
      .values({
        userId,
        opportunityId,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: schema.applications.id });

    const appId = newApp.id;

    // Seed default starter checklist items
    const defaultChecklist = [
      { title: "Review eligibility & submission requirements", sortOrder: 0 },
      { title: "Prepare resume / portfolio / transcript", sortOrder: 1 },
      { title: "Draft application essay or proposal", sortOrder: 2 },
      { title: "Request letters of recommendation (if required)", sortOrder: 3 },
      { title: "Submit official application form before deadline", sortOrder: 4 },
    ];

    await db.insert(schema.applicationChecklistItems).values(
      defaultChecklist.map((item) => ({
        applicationId: appId,
        title: item.title,
        isCompleted: false,
        sortOrder: item.sortOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    return appId;
  } catch (error) {
    console.error(`Error creating application for opp (${opportunityId}):`, error);
    throw error;
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  userId: string,
  status: ApplicationStatus
): Promise<boolean> {
  try {
    const { db } = getDb();

    const updateData: {
      status: ApplicationStatus;
      updatedAt: Date;
      submittedAt?: Date | null;
      decisionAt?: Date | null;
    } = {
      status,
      updatedAt: new Date(),
    };

    if (status === "submitted") {
      updateData.submittedAt = new Date();
    } else if (status === "accepted" || status === "rejected") {
      updateData.decisionAt = new Date();
    }

    await db
      .update(schema.applications)
      .set(updateData)
      .where(
        and(
          eq(schema.applications.id, applicationId),
          eq(schema.applications.userId, userId)
        )
      );

    return true;
  } catch (error) {
    console.error(`Error updating application status (${applicationId}):`, error);
    throw error;
  }
}

/**
 * Update notes and external info
 */
export async function updateApplicationNotes(
  applicationId: string,
  userId: string,
  notes: string | null,
  externalApplicationUrl: string | null,
  externalReference: string | null
): Promise<boolean> {
  try {
    const { db } = getDb();

    await db
      .update(schema.applications)
      .set({
        notes,
        externalApplicationUrl,
        externalReference,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.applications.id, applicationId),
          eq(schema.applications.userId, userId)
        )
      );

    return true;
  } catch (error) {
    console.error(`Error updating application notes (${applicationId}):`, error);
    throw error;
  }
}

/**
 * Delete an application
 */
export async function deleteApplication(
  applicationId: string,
  userId: string
): Promise<boolean> {
  try {
    const { db } = getDb();

    await db
      .delete(schema.applications)
      .where(
        and(
          eq(schema.applications.id, applicationId),
          eq(schema.applications.userId, userId)
        )
      );

    return true;
  } catch (error) {
    console.error(`Error deleting application (${applicationId}):`, error);
    throw error;
  }
}

/**
 * Add a checklist item
 */
export async function addChecklistItem(
  applicationId: string,
  userId: string,
  title: string,
  description?: string,
  dueAt?: Date
): Promise<ApplicationChecklistItem | null> {
  try {
    const { db } = getDb();

    // Verify ownership of the application
    const app = await db
      .select({ id: schema.applications.id })
      .from(schema.applications)
      .where(
        and(
          eq(schema.applications.id, applicationId),
          eq(schema.applications.userId, userId)
        )
      )
      .limit(1);

    if (app.length === 0) {
      throw new Error("Application not found or unauthorized");
    }

    const [item] = await db
      .insert(schema.applicationChecklistItems)
      .values({
        applicationId,
        title,
        description: description || null,
        dueAt: dueAt || null,
        isCompleted: false,
        sortOrder: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Touch application updatedAt
    await db
      .update(schema.applications)
      .set({ updatedAt: new Date() })
      .where(eq(schema.applications.id, applicationId));

    return item || null;
  } catch (error) {
    console.error(`Error adding checklist item (${applicationId}):`, error);
    throw error;
  }
}

/**
 * Toggle completion of a checklist item
 */
export async function toggleChecklistItem(
  itemId: string,
  userId: string,
  isCompleted: boolean
): Promise<boolean> {
  try {
    const { db } = getDb();

    // Verify ownership through join
    const itemRows = await db
      .select({
        id: schema.applicationChecklistItems.id,
        appId: schema.applicationChecklistItems.applicationId,
      })
      .from(schema.applicationChecklistItems)
      .innerJoin(
        schema.applications,
        eq(schema.applicationChecklistItems.applicationId, schema.applications.id)
      )
      .where(
        and(
          eq(schema.applicationChecklistItems.id, itemId),
          eq(schema.applications.userId, userId)
        )
      )
      .limit(1);

    if (itemRows.length === 0) {
      throw new Error("Checklist item not found or unauthorized");
    }

    await db
      .update(schema.applicationChecklistItems)
      .set({
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(schema.applicationChecklistItems.id, itemId));

    await db
      .update(schema.applications)
      .set({ updatedAt: new Date() })
      .where(eq(schema.applications.id, itemRows[0].appId));

    return true;
  } catch (error) {
    console.error(`Error toggling checklist item (${itemId}):`, error);
    throw error;
  }
}

/**
 * Delete a checklist item
 */
export async function deleteChecklistItem(
  itemId: string,
  userId: string
): Promise<boolean> {
  try {
    const { db } = getDb();

    // Verify ownership through join
    const itemRows = await db
      .select({
        id: schema.applicationChecklistItems.id,
        appId: schema.applicationChecklistItems.applicationId,
      })
      .from(schema.applicationChecklistItems)
      .innerJoin(
        schema.applications,
        eq(schema.applicationChecklistItems.applicationId, schema.applications.id)
      )
      .where(
        and(
          eq(schema.applicationChecklistItems.id, itemId),
          eq(schema.applications.userId, userId)
        )
      )
      .limit(1);

    if (itemRows.length === 0) {
      throw new Error("Checklist item not found or unauthorized");
    }

    await db
      .delete(schema.applicationChecklistItems)
      .where(eq(schema.applicationChecklistItems.id, itemId));

    return true;
  } catch (error) {
    console.error(`Error deleting checklist item (${itemId}):`, error);
    throw error;
  }
}
