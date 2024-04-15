import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
export const TableJob = () => {
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
            <TableHead className="text-center"></TableHead>
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
            <TableCell>View Job</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
