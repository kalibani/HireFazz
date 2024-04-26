'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePopupModal } from "@/hooks/use-popup-modal";
import { SearchCheckIcon } from "lucide-react";
import TableTempCV from "./Table-tempCV";
import { useFormStepStore } from "@/zustand/useCreateJob";

// only slicing, modify data later
const ModalUploadCv = () => {
  const { files } = useFormStepStore()

  const { isModalOpen, setIsModalOpen } = usePopupModal()

  const resultTable = (() => {
    if (!files.length) return <p className="text-center text-slate-400 text-sm my-auto">No CV here</p>

    return (
      <TableTempCV data={files} />
    )
  })()

  return (
    <Dialog modal open={isModalOpen('BANK_CV')} onOpenChange={(open) => setIsModalOpen('BANK_CV', open)}>
      <DialogContent className="max-w-[95vw] h-[90vh]">
        <div className="py-5 flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
          Upload CV ( From Bank CV Candidates )
        </DialogTitle>
          <DialogDescription className="text-center">
          if you has CV Candidates on your Bank CV  before.
          </DialogDescription>
        </DialogHeader>
        <Button
            type="button"
            variant="default"
            disabled={false}
            onClick={() => {}}
            className="w-fit mx-auto flex gap-2 my-10"
          >
            <SearchCheckIcon />
            Perform Inner Search
          </Button>

          <p className="text-center text-slate-400 text-sm">
            Please search from your Candidates CV.
          </p>

          {resultTable}

        {!!files.length && (
          <DialogFooter className="mt-auto">
            <Button>Add CV from Candidates</Button>
          </DialogFooter>
        )}
        </div>

      </DialogContent>
    </Dialog>

  )
}

export default ModalUploadCv