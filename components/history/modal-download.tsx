import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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

type Props = {
  isDisabled: boolean;
  selectedVoices: GeneratedVoicesHistory[];
  onDownload: (selectedVoices: GeneratedVoicesHistory[]) => void;
};

export function ModalDownload(props: Props) {
  const { isDisabled, onDownload, selectedVoices } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const unpaidSelectedVoices = useMemo(() => {
    return selectedVoices.filter((selected) => selected.isPaid === false);
  }, [selectedVoices]);

  const paidSelectedVoices = useMemo(() => {
    return selectedVoices.filter((selected) => selected.isPaid === true);
  }, [selectedVoices]);

  const onDownloadTrigger = () => {
    //only download paid voice

    if (unpaidSelectedVoices.length > 0) {
      setIsOpen(true);
    }

    if (paidSelectedVoices.length) onDownload(paidSelectedVoices);
  };

  const onPay = () => {
    //TODO:payment-gateway logic here
    // on payment success call this to download only unpaid items before
    // onDownload(unpaidSelectedVoices)
    //
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button
        onClick={onDownloadTrigger}
        disabled={isDisabled}
        className="mr-2"
        variant="premium2"
      >
        Download selected
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download selected items</DialogTitle>
          <DialogDescription>
            You've selected <b>{unpaidSelectedVoices.length}</b> unpaid items,
            to continue download you need to pay first
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" variant="premium" onClick={onPay}>
            Proceed to payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
