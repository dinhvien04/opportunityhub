import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  FileCheck,
  GraduationCap,
  Heart,
  Plane,
  Sparkles,
  Trophy,
  Wallet,
  type LucideProps,
} from "lucide-react";

interface CategoryIconProps extends LucideProps {
  nameOrSlug?: string | null;
}

export function CategoryIcon({ nameOrSlug, ...props }: CategoryIconProps) {
  const key = (nameOrSlug || "").toLowerCase().trim();

  if (key.includes("competition") || key.includes("hackathon") || key.includes("trophy")) {
    return <Trophy {...props} />;
  }
  if (key.includes("scholarship") || key.includes("graduation")) {
    return <GraduationCap {...props} />;
  }
  if (key.includes("internship") || key.includes("briefcase") || key.includes("job")) {
    return <Briefcase {...props} />;
  }
  if (key.includes("program") || key.includes("book")) {
    return <BookOpen {...props} />;
  }
  if (key.includes("event") || key.includes("workshop") || key.includes("conference") || key.includes("calendar")) {
    return <Calendar {...props} />;
  }
  if (key.includes("exchange") || key.includes("plane") || key.includes("abroad")) {
    return <Plane {...props} />;
  }
  if (key.includes("fellowship") || key.includes("award")) {
    return <Award {...props} />;
  }
  if (key.includes("volunteer") || key.includes("heart") || key.includes("community")) {
    return <Heart {...props} />;
  }
  if (key.includes("grant") || key.includes("wallet") || key.includes("fund")) {
    return <Wallet {...props} />;
  }
  if (key.includes("course") || key.includes("certificate") || key.includes("cert")) {
    return <FileCheck {...props} />;
  }

  return <Sparkles {...props} />;
}
