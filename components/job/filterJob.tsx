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
import { useParams } from 'next/navigation';

export const FilterJob = () => {
  const { orgId } = useParams();

  return (
    <div className="flex items-end justify-between">
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Search</label>
        <Input placeholder="Location" />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Search</label>
        <Input placeholder="Search Job" />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Status</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Active" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Not Analyzed">Not Analyzed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Link href={`/${orgId}/job/create`}>
        <Button variant="secondary">+ Create New Job</Button>
      </Link>
    </div>
  );
};
