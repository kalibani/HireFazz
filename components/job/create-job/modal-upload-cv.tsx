'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePopupModal, MODAL_ENUM } from "@/hooks/use-popup-modal";
import { SearchCheckIcon } from "lucide-react";
import TableCV from "./table";
import { useFormStepStore } from "@/zustand/useCreateJob";
import ImportCVTable from "./import-cv-table";
import { ThirdPartyCVData, columns as ThirdPartyColumns } from './table/third-party-cv'
import { columns as UploadCVColumns, UploadCVData } from './table/upload-cv'


const textContent = {
  [MODAL_ENUM.BANK_CV]: {
    title: 'Upload CV ( From Bank CV Candidates )',
    subTitle: 'if you has CV Candidates on your Bank CV  before.',
  },
  [MODAL_ENUM.THIRD_PARTY_CV]: {
    title: 'Upload CV ( From Integration 3rd Party )',
    subTitle: 'Please import cv from Integration 3rd party job portal'
  }
}

// change mock when integrate
const mockImportPlatformData = [
  {
    candidates: 120,
    createdAt: Date.now(),
    jobName: 'Product Manager'
  },
  {
    candidates: 135,
    createdAt: Date.now(),
    jobName: 'Product Designer'
  },
]

// make the list empty to view import table
const mockThirdPartyCVData: ThirdPartyCVData[] = [
  {
    name: 'Haylie Korsgaard',
    jobName: 'Senior Software Enginer',
    appliedAt: Date.now(),
    location: 'Jakarta'
  }
]

const mockThirdPartyCVFrom = 'LinkedIn'

// only slicing, modify data later
const ModalUploadCv = () => {
  const { files } = useFormStepStore()

  const { setIsModalOpen, getOpenModalEnum } = usePopupModal()
  const openedModal = getOpenModalEnum()

  if (!openedModal) {
    return null
  }

  const { title, subTitle } = textContent[openedModal]

  // temporary var to switch cta visibility
  const showCTA = {
    [MODAL_ENUM.BANK_CV]: !!files.length,
    [MODAL_ENUM.THIRD_PARTY_CV]: !!mockThirdPartyCVData.length,
  }

  const dialogContent = (() => {
    if (openedModal === MODAL_ENUM.BANK_CV) {
      return (
        <>
          <Button
            type="button"
            variant="default"
            onClick={() => {}}
            className="w-fit mx-auto flex gap-2 my-10"
          >
            <SearchCheckIcon />
            Perform Inner Search
          </Button>

            <p className="text-center text-slate-400 text-sm">
              Please search from your Candidates CV.
            </p>

            {!files.length ? (
              <p className="text-center text-slate-400 text-sm my-auto">No CV here</p>
            ): (
              <TableCV<UploadCVData> data={files} columns={UploadCVColumns} totalItems={files.length} />
            )}
        </>
      )
    }

    if (openedModal === MODAL_ENUM.THIRD_PARTY_CV) {
      return (
        <div className="mt-16">          
          {!!mockThirdPartyCVData.length ? (
            <TableCV<ThirdPartyCVData> data={mockThirdPartyCVData} columns={ThirdPartyColumns} dataFrom={mockThirdPartyCVFrom} totalItems={mockThirdPartyCVData.length} />
          ): (
            <ImportCVTable data={mockImportPlatformData} />
          )}
        </div>
      )
    }
  })()
  

  return (
    <Dialog modal open={!!openedModal} onOpenChange={(open) => setIsModalOpen(openedModal, open)}>
      <DialogContent className="max-w-[95vw] h-[90vh]">
        <div className="py-5 flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {subTitle}
          </DialogDescription>
        </DialogHeader>

        {dialogContent}

        {showCTA[openedModal] && (
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