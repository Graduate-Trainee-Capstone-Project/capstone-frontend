import {cn} from "@/app/_utils/cn";

export function Skeleton({className}: {className?: string}) {
  return <div className={cn("animate-pulse rounded-lg bg-grey-100", className)} />;
}
