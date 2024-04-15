import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';

export const FilterJob = () => {
  return (
    <div className="flex justify-between">
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Sort By</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Applicant" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Level</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Senior" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Search</label>
        <Input placeholder="Location" />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">Search</label>
        <Input placeholder="Search Job" />
      </div>
    </div>
  );
};
