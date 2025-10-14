import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MentorCardSkeleton() {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" /> {/* mentor name */}
            <Skeleton className="h-4 w-24" /> {/* role or expertise */}
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-16" /> {/* experience */}
              <Skeleton className="h-4 w-20" /> {/* rating */}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" /> {/* calendar icon */}
          <Skeleton className="h-4 w-24" /> {/* available date/time */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" /> {/* interview type */}
          <Skeleton className="h-4 w-32" /> {/* description */}
        </div>
        <Skeleton className="h-12 w-full" /> {/* book interview button */}
        <Skeleton className="h-6 w-20" /> {/* price */}
      </CardContent>
    </Card>
  );
}

export function MentorCardsLoading() {
  // this will show 6 skeleton cards while loading mentors
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MentorCardSkeleton key={i} />
      ))}
    </div>
  );
}
