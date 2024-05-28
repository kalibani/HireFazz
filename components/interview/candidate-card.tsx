import { TCandidateListSchema } from '@/lib/validators/interview';
import { Flag, CircleEllipsis } from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const CandidatesCard = ({
  dataSource,
  index,
}: {
  dataSource: TCandidateListSchema;
  index: number;
}) => {
  return (
    <div className="flex flex-col  justify-between rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold">
          {dataSource.name} Candidates # {index + 1}
        </h4>
        <div className="flex items-center gap-x-2 text-sm font-bold text-green-500">
          <Flag className="size-4" />
          <p className="capitalize">Status: {dataSource.status} </p>
        </div>
      </div>
      <div className="flex items-start  justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{dataSource.templateName}</p>
          <div className="w-fit rounded-md border p-1.5 text-xs">
            {dataSource.candidatesCount} Candidates
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleEllipsis className="text-primary" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Update Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CandidatesCard;
