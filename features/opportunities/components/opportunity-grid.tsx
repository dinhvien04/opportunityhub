import { OpportunityCard } from "./opportunity-card";
import type { OpportunitySummary } from "../types";

interface OpportunityGridProps {
  opportunities: OpportunitySummary[];
}

export function OpportunityGrid({ opportunities }: OpportunityGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {opportunities.map((opp, index) => (
        <OpportunityCard
          key={opp.id}
          opportunity={opp}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
