import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreVertical } from 'lucide-react'
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Pagination from '../ui/pagination';
import { PER_PAGE_ITEMS } from '@/constant';

export const TableJob = () => {
  const orgId = '123'
  const jobId = '1'
  return (
    <div className="mt-4">
      <Table className="border border-solid border-slate-200">
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Job Name ↓ </TableHead>
            <TableHead className="text-center">Candidates ↓</TableHead>
            <TableHead className="text-center">Created at ↓</TableHead>
            <TableHead className="text-center">Shortlisted ↓</TableHead>
            <TableHead className="text-center">Company Name ↓</TableHead>
            <TableHead className="text-center">Status ↓</TableHead>
            <TableHead className="text-center w-32"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              Senior Software Engineer
            </TableCell>
            <TableCell className="text-center text-slate-400">143</TableCell>
            <TableCell className="text-center text-slate-400">
              20 Mar, 2024
            </TableCell>
            <TableCell className="text-center text-slate-400">10</TableCell>
            <TableCell className="text-center text-slate-400">
              Berrylabs
            </TableCell>
            <TableCell className="text-center text-green-500">Active</TableCell>
            <TableCell className="flex gap-2 items-center">
              {/* CHANGE HREF TO DETAIL JOB LATER */}
              <Link href={`/${orgId}/job/${jobId}/all-applicant`} className="text-red-500 underline font-medium">
                View Job
              </Link>

              <MoreVertical className="cursor-pointer" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-5">
        <div className="max-w-44 flex gap-2 items-center">
          <span>View</span>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="50" defaultValue="50" />
            </SelectTrigger>

            {/* MODIFY OPTIONS LATER WHEN READY FROM DESIGN */}
            <SelectContent>
              {PER_PAGE_ITEMS.map((pageItem) => <SelectItem key={pageItem} value={pageItem}>{pageItem}</SelectItem>)}
            </SelectContent>
          </Select>

          <span>List</span>
        </div>
        <div className="space-x-2">
          <Pagination itemsPerPage={20} totalItems={200} />
        </div>

        <div></div>
      </div>
    </div>
  );
};
