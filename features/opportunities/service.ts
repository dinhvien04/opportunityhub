import {
  getCategories,
  getFeaturedOpportunities,
  getOpportunityBySlug,
  searchOpportunities,
} from "./repository";
import type {
  CategoryWithCount,
  OpportunityDetail,
  OpportunityFilterParams,
  OpportunitySummary,
  PaginatedOpportunities,
} from "./types";

export class OpportunityService {
  static async getCategories(): Promise<CategoryWithCount[]> {
    return getCategories();
  }

  static async getFeatured(limit: number = 6): Promise<OpportunitySummary[]> {
    return getFeaturedOpportunities(limit);
  }

  static async search(
    params: OpportunityFilterParams
  ): Promise<PaginatedOpportunities> {
    return searchOpportunities(params);
  }

  static async getBySlug(slug: string): Promise<OpportunityDetail | null> {
    return getOpportunityBySlug(slug);
  }
}
