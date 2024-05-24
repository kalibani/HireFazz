import { Copy, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PopupPreviewQuestions = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto gap-x-2 p-0 text-xs font-normal hover:bg-transparent"
          type="button"
        >
          <Search className="size-3 text-primary" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="border-b py-4">
          <DialogTitle className="text-center text-2xl font-semibold">
            Preview Interview Question
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-[200px] justify-between space-x-2">
          <div>Listquestion</div>
          <div>Content</div>
          <div>video</div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupPreviewQuestions;
