import { CircleAlert } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Cartes grises pendant le chargement, à la place d'un rond qui tourne. */
export function CardsSkeleton({ count, className }: { count: number; className?: string }) {
  return (
    <div className={className} role="status" aria-label="Chargement">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="mb-3 aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="mx-auto h-4 w-2/3" />
          <Skeleton className="mx-auto mt-2 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/** Message d'erreur de chargement. */
export function ErrorMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="destructive" className={cn("mx-auto max-w-xl", className)}>
      <CircleAlert />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
