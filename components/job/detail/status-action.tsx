'use client'
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStoreEmail } from "@/zustand/useStoreEmail";
import { ANALYSYS_STATUS } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface StatusActionProps {
    setIsLoading?: (value: boolean) => void
    getSelectedRowIds: () => string[]
    onApiEnd?: () => void
}

const StatusAction = ({
    setIsLoading,
    getSelectedRowIds,
    onApiEnd,
}: StatusActionProps) => {
  const [selectedAction, setSelectedAction] = useState('SHORTLISTED');
  const params = useParams();
  const { push } = useRouter()
  const { setIds } = useStoreEmail((state) => state);


    // todo: handle action list for delete & send email
    const actionList = [
        ANALYSYS_STATUS.SHORTLISTED,
        ANALYSYS_STATUS.REJECTED,
        ANALYSYS_STATUS.INTERVIEW,
        'DELETE',
        'Send Email',
    ];


  const handleAction = () => {
    if (!confirm(`${selectedAction} all selected items?`)) {
      return;
    }

    setIsLoading?.(true);
    if (selectedAction === 'DELETE') {
      axios
        .delete('/api/cv-analysis', {
          data: {
            selectedIds: getSelectedRowIds(),
          },
        })
        .finally(onApiEnd);
    } else if (selectedAction === 'Send Email') {
      setIds(getSelectedRowIds());
      push(`/${params?.orgId}/job/${params?.id}/send-email`);
    } else {
      let redirectPath = selectedAction.toLowerCase()
      if (redirectPath === 'interview') {
        redirectPath = 'interviewed'
      }
      axios
        .patch(`/api/cv-analysis`, {
          actionName: selectedAction,
          selectedIds: getSelectedRowIds(),
        })
        .finally(onApiEnd);
      push(
        `/${params?.orgId}/job/${params?.id}/${redirectPath}`,
      );
    }
  };

    return (
        <>
            <Select onValueChange={(v) => setSelectedAction(v)}>
                <SelectTrigger className="h-[30px] w-fit text-xs capitalize">
                    <SelectValue
                        placeholder="Shortlisted"
                        defaultValue="SHORTLISTED" />
                </SelectTrigger>

                <SelectContent>
                    {actionList.map((action) => (
                        <SelectItem key={action} value={action} className="capitalize">
                            {action.toLowerCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button className="h-[30px] px-2 text-xs" onClick={handleAction} disabled={!getSelectedRowIds().length}>
                Action
            </Button>
        </>
    )
}

export default StatusAction