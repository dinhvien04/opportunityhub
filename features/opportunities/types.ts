import type {
  Category,
  OpportunityBenefit,
  OpportunityDocument,
  OpportunityEligibilityItem,
  OpportunityRequirement,
  Organization,
  Skill,
  Tag,
} from "@/lib/db/schema";

export type OpportunityMode = "online" | "offline" | "hybrid";
export type OpportunityStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "closed"
  | "archived";

export interface OpportunitySummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;
  registrationUrl: string | null;
  sourceUrl: string | null;
  mode: OpportunityMode | string | null;
  countryCode: string | null;
  city: string | null;
  venue: string | null;
  startAt: Date | string | null;
  endAt: Date | string | null;
  deadlineAt: Date | string | null;
  feeAmount: string;
  currency: string;
  isFree: boolean | null;
  status: OpportunityStatus | string;
  verified: boolean;
  featured: boolean;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  } | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    verified: boolean;
    city: string | null;
    countryCode: string | null;
  } | null;
}

export interface OpportunityDetail extends OpportunitySummary {
  maxParticipants: number | null;
  teamMinSize: number | null;
  teamMaxSize: number | null;
  benefits: OpportunityBenefit[];
  eligibility: OpportunityEligibilityItem[];
  requirements: OpportunityRequirement[];
  documents: OpportunityDocument[];
  skills: {
    skill: Skill;
    importance: number;
    required: boolean;
  }[];
  tags: Tag[];
  organizationDetail?: Organization | null;
}

export type SortOption = "relevance" | "newest" | "deadline_soon" | "alphabetical";

export type DeadlineFilterOption = "any" | "this_week" | "this_month" | "next_3_months";

export type PriceFilterOption = "all" | "free" | "paid";

export interface OpportunityFilterParams {
  q?: string;
  category?: string; // category slug
  mode?: "all" | "online" | "offline" | "hybrid";
  price?: PriceFilterOption;
  deadline?: DeadlineFilterOption;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedOpportunities {
  items: OpportunitySummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CategoryWithCount = Category & {
  opportunityCount?: number;
};
