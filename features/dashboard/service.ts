import { getDashboardData } from "./repository";

export const DashboardService = {
  getSummary: async (userId: string) => {
    return getDashboardData(userId);
  },
};
