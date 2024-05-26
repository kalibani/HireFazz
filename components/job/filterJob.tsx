'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

export const FilterJob = () => {
  const { orgId } = useParams();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const { replace } = useRouter();

  // FUTURE IMPROVEMENT: add debounce on search input
  function handleSearch(
    query: 'location' | 'jobName' | 'status',
    term: string,
  ) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(query, term);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-end justify-between">
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Search</label>
        <Input
          placeholder="Location"
          defaultValue={searchParams.get('location') || ''}
          onChange={(e) => handleSearch('location', e.target.value)}
        />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Search</label>
        <Input
          placeholder="Search Job"
          defaultValue={searchParams.get('jobName') || ''}
          onChange={(e) => handleSearch('jobName', e.target.value)}
        />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Status</label>
        <Select onValueChange={(value) => handleSearch('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Active" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Not_Analyzed">Not Analyzed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Link href={`/${orgId}/job/create`}>
        <Button>+ Create New Job</Button>
      </Link>
    </div>
  );
};
