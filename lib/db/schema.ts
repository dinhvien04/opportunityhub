import {
  boolean,
  char,
  integer,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Categories Table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Organizations Table
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  organizationType: text("organization_type").notNull().default("company"),
  description: text("description"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  contactEmail: varchar("contact_email", { length: 255 }),
  countryCode: char("country_code", { length: 2 }),
  city: varchar("city", { length: 255 }),
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verifiedBy: uuid("verified_by"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Opportunities Table
export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  categoryId: uuid("category_id").references(() => categories.id),
  createdBy: uuid("created_by"),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: varchar("short_description", { length: 500 }),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  registrationUrl: text("registration_url"),
  sourceUrl: text("source_url"),
  mode: text("mode").default("online"), // 'online' | 'offline' | 'hybrid'
  countryCode: char("country_code", { length: 2 }),
  city: varchar("city", { length: 255 }),
  venue: text("venue"),
  startAt: timestamp("start_at", { withTimezone: true }),
  endAt: timestamp("end_at", { withTimezone: true }),
  deadlineAt: timestamp("deadline_at", { withTimezone: true }),
  feeAmount: numeric("fee_amount").notNull().default("0"),
  currency: char("currency", { length: 3 }).notNull().default("USD"),
  isFree: boolean("is_free").default(true),
  maxParticipants: integer("max_participants"),
  teamMinSize: integer("team_min_size"),
  teamMaxSize: integer("team_max_size"),
  status: text("status").notNull().default("draft"), // 'draft' | 'pending_review' | 'published' | 'closed' | 'archived'
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verifiedBy: uuid("verified_by"),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. Opportunity Benefits
export const opportunityBenefits = pgTable("opportunity_benefits", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. Opportunity Eligibility
export const opportunityEligibility = pgTable("opportunity_eligibility", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  criterion: varchar("criterion", { length: 255 }).notNull(),
  details: text("details"),
  isRequired: boolean("is_required").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. Opportunity Requirements
export const opportunityRequirements = pgTable("opportunity_requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  requirementType: varchar("requirement_type", { length: 100 }),
  isRequired: boolean("is_required").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. Opportunity Documents
export const opportunityDocuments = pgTable("opportunity_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  documentType: varchar("document_type", { length: 100 }),
  fileUrl: text("file_url"),
  sourceUrl: text("source_url"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Skills Table
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. Opportunity Skills
export const opportunitySkills = pgTable(
  "opportunity_skills",
  {
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    importance: smallint("importance").notNull().default(1),
    required: boolean("required").notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.opportunityId, t.skillId] })]
);

// 10. Tags Table
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 11. Opportunity Tags
export const opportunityTags = pgTable(
  "opportunity_tags",
  {
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.opportunityId, t.tagId] })]
);

// 12. Interests Table
export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 13. Opportunity Interests
export const opportunityInterests = pgTable(
  "opportunity_interests",
  {
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    interestId: uuid("interest_id")
      .notNull()
      .references(() => interests.id, { onDelete: "cascade" }),
    weight: smallint("weight").notNull().default(3),
  },
  (t) => [primaryKey({ columns: [t.opportunityId, t.interestId] })]
);

// 14. User Profiles Table
export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey(),
  username: varchar("username", { length: 255 }),
  displayName: varchar("display_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  university: varchar("university", { length: 255 }),
  major: varchar("major", { length: 255 }),
  graduationYear: smallint("graduation_year"),
  city: varchar("city", { length: 255 }),
  countryCode: char("country_code", { length: 2 }).default("VN"),
  websiteUrl: text("website_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  appRole: text("app_role").notNull().default("member"), // 'member' | 'organizer' | 'admin'
  isPublic: boolean("is_public").notNull().default(true),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 15. User Interests Table
export const userInterests = pgTable(
  "user_interests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userProfiles.userId, { onDelete: "cascade" }),
    interestId: uuid("interest_id")
      .notNull()
      .references(() => interests.id, { onDelete: "cascade" }),
    weight: smallint("weight").notNull().default(3),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.interestId] })]
);

// 16. User Skills Table
export const userSkills = pgTable(
  "user_skills",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userProfiles.userId, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    level: text("level").notNull().default("beginner"), // 'beginner' | 'intermediate' | 'advanced' | 'expert'
    yearsExperience: numeric("years_experience"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.skillId] })]
);

// 17. Saved Opportunities Table
export const savedOpportunities = pgTable(
  "saved_opportunities",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userProfiles.userId, { onDelete: "cascade" }),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.opportunityId] })]
);

// 18. Applications Table
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("preparing"), // 'interested' | 'preparing' | 'submitted' | 'reviewing' | 'interview' | 'waitlisted' | 'accepted' | 'rejected' | 'withdrawn'
  externalApplicationUrl: text("external_application_url"),
  externalReference: varchar("external_reference", { length: 255 }),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  decisionAt: timestamp("decision_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 19. Application Checklist Items Table
export const applicationChecklistItems = pgTable("application_checklist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueAt: timestamp("due_at", { withTimezone: true }),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 20. Notifications Table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull().default("system"),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  actionUrl: text("action_url"),
  metadata: text("metadata").notNull().default("{}"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Drizzle Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  opportunities: many(opportunities),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  opportunities: many(opportunities),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [opportunities.organizationId],
    references: [organizations.id],
  }),
  category: one(categories, {
    fields: [opportunities.categoryId],
    references: [categories.id],
  }),
  benefits: many(opportunityBenefits),
  eligibility: many(opportunityEligibility),
  requirements: many(opportunityRequirements),
  documents: many(opportunityDocuments),
  skills: many(opportunitySkills),
  tags: many(opportunityTags),
  interests: many(opportunityInterests),
  savedBy: many(savedOpportunities),
  applications: many(applications),
}));

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  skills: many(userSkills),
  interests: many(userInterests),
  savedOpportunities: many(savedOpportunities),
  applications: many(applications),
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userSkills.userId],
    references: [userProfiles.userId],
  }),
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}));

export const userInterestsRelations = relations(userInterests, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userInterests.userId],
    references: [userProfiles.userId],
  }),
  interest: one(interests, {
    fields: [userInterests.interestId],
    references: [interests.id],
  }),
}));

export const savedOpportunitiesRelations = relations(savedOpportunities, ({ one }) => ({
  user: one(userProfiles, {
    fields: [savedOpportunities.userId],
    references: [userProfiles.userId],
  }),
  opportunity: one(opportunities, {
    fields: [savedOpportunities.opportunityId],
    references: [opportunities.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(userProfiles, {
    fields: [applications.userId],
    references: [userProfiles.userId],
  }),
  opportunity: one(opportunities, {
    fields: [applications.opportunityId],
    references: [opportunities.id],
  }),
  checklistItems: many(applicationChecklistItems),
}));

export const applicationChecklistItemsRelations = relations(
  applicationChecklistItems,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationChecklistItems.applicationId],
      references: [applications.id],
    }),
  })
);

// Inferred Types
export type Category = typeof categories.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type OpportunityBenefit = typeof opportunityBenefits.$inferSelect;
export type OpportunityEligibilityItem = typeof opportunityEligibility.$inferSelect;
export type OpportunityRequirement = typeof opportunityRequirements.$inferSelect;
export type OpportunityDocument = typeof opportunityDocuments.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Interest = typeof interests.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type UserInterest = typeof userInterests.$inferSelect;
export type SavedOpportunity = typeof savedOpportunities.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationChecklistItem = typeof applicationChecklistItems.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
