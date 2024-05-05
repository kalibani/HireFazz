import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Airplay, ChevronDown, FileSearchIcon, ShieldPlus, Trash2, Zap } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/ui/pagination';
import { PER_PAGE_ITEMS } from '@/constant';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const DetailJobTable = () => {
    const jobTitle = 'Senior Software Engineer'
    const actionList = [
        'Shortlisted',
        'Rejected',
        'Interviewed',
        'Delete',
        'Send Email']
    return (
        <div className="mt-4">
            <div className="flex justify-between">
                <div className="text-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FileSearchIcon className="text-red-500 size-4" />
                        <p>
                            There is <b>1 CVs</b> has been added with job tittle{' '}
                            <b>
                                “{jobTitle}”
                            </b>
                        </p>
                    </div>

                    <span className="pl-6 mt-4">
                        Status: <span className="text-blue-700">3/5 Uploading...</span>
                    </span>

                </div>

                <div className="flex flex-col items-end">
                    <Button className="flex gap-2 py-1 text-sm">
                        <Airplay className="size-6" />
                        Analyze AI
                    </Button>

                    <div className="flex gap-2 items-center mt-2 text-sm">
                        <div className="flex gap-1 items-center">
                            <Zap className="size-4 text-rose-500" />
                            <span><b>6 Quotas</b> Remaining</span>
                        </div>

                        <Button variant="ghost" className="text-rose-500 flex gap-1 px-0 font-bold items-center hover:bg-transparent hover:text-rose-500">
                            <ShieldPlus className="size-4" />
                            Topup
                        </Button>
                    </div>
                </div>
            </div>


            <div className="mt-4 w-full border rounded-t-md">
                <div className="flex gap-2 items-center py-2 px-4">
                    <div className="flex gap-1 items-center mr-3">
                        <Checkbox
                            aria-label="Select all"
                            className="border-slate-400 bg-white text-black"
                        />
                        <ChevronDown className="size-4" />
                    </div>
                    <Select>
                        <SelectTrigger className="h-[30px] w-fit text-xs">
                            <SelectValue placeholder="Delete" defaultValue="Delete" />
                        </SelectTrigger>


                        <SelectContent>
                            {actionList.map((action) => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button className="text-xs h-[30px] px-2">
                        Action
                    </Button>
                </div>

                <div className="w-full bg-rose-100 flex justify-center items-center py-3 text-xs">
                    <span className="text-slate-400">3 CV Selected, or </span>
                    &nbsp;
                    <span className="text-rose-600 font-medium">select all cv on this page</span>
                </div>
            </div>

            <Table className="border border-solid border-slate-200">
                <TableHeader className="bg-slate-200">
                    <TableRow>
                        <TableHead className="w-6"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-left">Job</TableHead>
                        <TableHead className="text-left">Added On</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                        <TableHead className="text-center w-32"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Checkbox />
                        </TableCell>
                        <TableCell>
                            Haylie Korsgaard
                        </TableCell>
                        <TableCell className="text-slate-400">
                            Senior Software Engineer
                        </TableCell>
                        <TableCell className="text-left text-slate-400">
                            20 Mar, 2024
                        </TableCell>
                        <TableCell className="text-left text-green-400">
                            Analyzed
                        </TableCell>
                        <TableCell className="flex gap-2 items-center">
                            <Button variant="ghost">
                                <Trash2 className="text-red-400" />
                            </Button>
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
