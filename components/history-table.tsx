"use-client";

import React, { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Play } from "lucide-react";

import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { DataTable } from "./table/data-table";
import { ComboboxFilterPaid, PaidStatus } from "./history/combobox-filter-paid";

import { trpc } from "@/app/_trpc/client";
import { $Enums } from "@prisma/client";
import { ModalDownload } from "./history/modal-download";
import { ModalDelete } from "./history/modal-delete";
import { downloadHistory, getAudioFromHistory } from "@/lib/axios";
import toast from "react-hot-toast";
import { downloadBlobFile } from "@/lib/utils";
import { useTextToSpeechStore } from "@/hooks/use-text-to-speech";
import { useShallow } from "zustand/react/shallow";
import AudioPlayer from "./audio-player";

export type GeneratedVoicesHistory = {
  id: string;
  text: string;
  //string for table
  dateUnix: string | number;
  voiceName: string;
  state: $Enums.State;
  action?: string;
  //string for table
  isPaid?: string | boolean;
  historyItemId?: string;
};

export type CurrentPlay = {
  category: string;
  name: string;
};

const stateColor = {
  created: "bg-green-500",
  deleted: "bg-red-500",
  processing: "bg-blue-500",
};

const PAGE_LIMIT = 5;

const HistoryTable = () => {
  const [selected, setSelected] = useState<GeneratedVoicesHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [paidStatus, setPaidStatus] = useState<PaidStatus>("");
  const [currentPlay, setCurrentPlay] = useState<CurrentPlay>();

  const {
    selectedVoice,
    selectVoice,
    formattedVoices,
    setFormattedVoices,
    expanded,
    onExpand,
    stream,
    setStream,
    selectedVoiceTemp,
    blob,
  } = useTextToSpeechStore(useShallow((state) => state));

  const { data, isLoading, refetch } = trpc.getGeneratedVoices.useQuery({
    limit: PAGE_LIMIT,
    offset,
    isPaid:
      paidStatus === "" ? undefined : paidStatus === "unpaid" ? false : true,
  });

  const generatedVoices = data?.generatedVoices || [];
  const count = data?.count || 0;

  const columnHelper = createColumnHelper<GeneratedVoicesHistory>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        cell: (info) => (
          <Checkbox
            onCheckedChange={() => onSelect(info.row.original)}
            checked={Boolean(selected.find((s) => s.id === info.getValue()))}
          />
        ),
        header: () => (
          <Checkbox
            onCheckedChange={onSelectAll}
            checked={isSelectedAll}
            disabled={generatedVoices?.length === 0}
          />
        ),
      }),
      columnHelper.accessor("voiceName", {
        cell: (info) => info.renderValue(),
        header: () => "Voice",
      }),
      columnHelper.accessor("dateUnix", {
        cell: (info) => {
          const date = new Date(Number(info.getValue()) * 1000);
          return (
            <i className="text-gray-500">
              {date.getMonth()}/{date.getDate()}/{date.getFullYear()},{" "}
              {date.getHours()}:{date.getMinutes()}
            </i>
          );
        },
        header: () => "Date",
      }),
      columnHelper.accessor("state", {
        cell: (info) => {
          const value = info.renderValue() as $Enums.State;
          return <Badge className={stateColor[value]}>{value}</Badge>;
        },
        header: () => "State",
      }),
      columnHelper.accessor("text", {
        header: () => <span>Text</span>,
      }),
      columnHelper.accessor("isPaid", {
        header: () => <span>Paid</span>,
        cell: (info) => {
          const isPaid = info.getValue();
          return (
            <Badge variant={isPaid ? "premium" : "destructive"}>
              {isPaid ? "Paid" : "Unpaid"}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("action", {
        header: () => <></>,
        cell: (info) => (
          <Play
            onClick={() =>
              onGetVoice(
                info.row.original.historyItemId as string,
                info.row.original.voiceName
              )
            }
            className="cursor-pointer w-4 h-4 text-black"
          />
        ),
      }),
    ];
  }, [selected, generatedVoices]);

  const isSelectedAll = useMemo(() => {
    return selected.length === generatedVoices?.length;
  }, [selected, generatedVoices]);

  const onSelect = (data: GeneratedVoicesHistory) => {
    const newSelected = [...selected];

    const currentIndex = newSelected.findIndex((s) => s.id === data.id);

    if (currentIndex >= 0) {
      newSelected.splice(currentIndex, 1);
    } else newSelected.push(data);

    setSelected(newSelected);
  };

  const onSelectAll = () => {
    if (isSelectedAll) {
      setSelected([]);
    } else setSelected(generatedVoices || []);
  };

  const onFetchNextPage = async () => {
    setCurrentPage((prev) => prev + 1);
    setOffset((prev) => prev + PAGE_LIMIT);
  };

  const onFetchPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
    setOffset((prev) => prev - PAGE_LIMIT);
  };

  const onDelete = async () => {
    setSelected([]);
    await refetch();
  };

  const onDownload = async (selectedVoices: GeneratedVoicesHistory[]) => {
    try {
      const res = await downloadHistory(
        selectedVoices.map((s) => s.historyItemId as string)
      );
      const dataBlob = res.data;
      const blob = new Blob([dataBlob], {
        type: "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);

      downloadBlobFile(
        url,
        `berry_labs_generated_voices${
          selectedVoices.length === 1 ? ".mp3" : ".zip"
        }`
      );
    } catch (error) {
      toast("There was a problem, Please try again in a moment...");
    }
  };

  const onGetVoice = async (historyId: string, voiceName: string) => {
    try {
      const res = await getAudioFromHistory(historyId);

      const blob = new Blob([res.data], {
        type: "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);
      setStream(url);
      setCurrentPlay({
        category: "generated history",
        name: voiceName,
      });
      selectVoice({
        name: currentPlay?.name,
        category: currentPlay?.category,
        isPlaying: false,
      });
    } catch (error) {
      toast("There was a problem, Please try again in a moment...");
    }
  };

  const handlePlayVoice = (voice: any) => {
    // update isPlaying
    const updatedVoices = formattedVoices.map((v: any) =>
      v.voice_id === voice.voice_id
        ? {
            ...v,
            isPlaying: !voice.isPlaying,
          }
        : {
            ...v,
            isPlaying: false,
          }
    );
    setFormattedVoices(updatedVoices);
    // set voice to store
    const updatedVoice = {
      ...voice,
      name: currentPlay?.name,
      category: currentPlay?.category,
      isPlaying: !voice.isPlaying,
    };
    selectVoice(updatedVoice);
  };

  return (
    <div className="w-full flex flex-col h-screen">
      <div className="mb-4 flex items-center justify-between px-4 lg:px-8 ">
        <div>
          <ModalDownload
            isDisabled={selected.length === 0}
            selectedVoices={selected}
            onDownload={(items) => onDownload(items)}
          />
          <ModalDelete
            isDisabled={selected.length === 0}
            selectedVoices={selected}
            onDelete={onDelete}
          />
        </div>
        <div>
          <ComboboxFilterPaid
            paidStatus={paidStatus}
            setPaidStatus={setPaidStatus}
          />
        </div>
      </div>
      <div className="flex-1 px-4 lg:px-8 ">
        <DataTable
          tableClassName="rounded-md border-r-gray-200/70 border-l-gray-200/70 border relative"
          tableHeaderClassName="bg-gray-300/30"
          tableHeadClassName="text-black font-bold"
          columns={columns}
          data={generatedVoices || []}
          pageIndex={currentPage}
          pageSize={count}
          onNextPage={onFetchNextPage}
          onPreviousPage={onFetchPreviousPage}
          disableNextPage={
            offset + PAGE_LIMIT > count || generatedVoices?.length === 0
          }
          disablePreviousPage={offset === 0 || generatedVoices?.length === 0}
          isLoading={isLoading}
        />
      </div>

      {/* audio player start */}
      {(stream || Object.keys(selectedVoice).length) && expanded ? (
        <AudioPlayer
          selectedVoice={selectedVoice}
          selectVoice={selectVoice}
          handlePlayVoice={handlePlayVoice}
          onExpand={onExpand}
          stream={stream}
          selectedVoiceTemp={selectedVoiceTemp}
        />
      ) : null}
    </div>
  );
};

export default HistoryTable;
