import { Button } from '@/components/ui/button';
import { UploadCloud } from "lucide-react";

export const HeaderJob = () => {
  return (
    <div className="flex justify-between rounded-md bg-white px-5 py-2.5">
      <div>
        <h3 className="text-xl">Job List</h3>
        <p className="text-sm text-slate-400">
          Latest Job that you added on Job List
        </p>
      </div>
      <Button className="flex items-center gap-2">
        <UploadCloud />
         Upload CV
      </Button>
    </div>
  );
};
