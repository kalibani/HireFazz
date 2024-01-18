import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { GeneratedVoicesHistory } from "../history-table";
import { Loader2 } from "lucide-react";

type Props = {
  isDisabled: boolean;
  onDelete: () => void;
  selectedVoices: GeneratedVoicesHistory[];
};

export function ModalDelete(props: Props) {
  const { isDisabled, selectedVoices, onDelete } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteGeneratedVoices = trpc.deleteGeneratedVoices.useMutation();

  const handleDelete = async () => {
    setIsLoading(true);

    const ids = selectedVoices.map((voice) => voice.id);

    try {
      await deleteGeneratedVoices.mutateAsync({ ids });
      onDelete();
      setIsOpen(false);
      toast("delete success");
    } catch (error) {
      toast("There was a problem, Please try again in a moment...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} className="mr-2" variant="destructive">
          Delete selected
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete selected items</DialogTitle>
          <DialogDescription>
            You're about to delete <b>{selectedVoices?.length}</b> items, this
            action can't be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
