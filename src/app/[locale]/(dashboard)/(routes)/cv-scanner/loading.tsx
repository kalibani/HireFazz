import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-16 w-1/2 rounded-xl " />
    <Skeleton className="h-24 w-full rounded-xl " />
    <Skeleton className="h-52 w-full rounded-xl " />
  </div>
);

export default Loading;
