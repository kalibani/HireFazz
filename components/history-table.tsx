"use-client";

import React, { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Play } from "lucide-react";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { DataTable } from "./table/data-table";

import { trpc } from "@/app/_trpc/client";
import { $Enums } from "@prisma/client";

type Data = {
  id: string;
  text: string;
  dateUnix: string | number;
  voiceName: string;
  state: $Enums.State;
  action?: string;
};

const PAGE_LIMIT = 5;

const HistoryTable = () => {
  const [selected, setSelected] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = trpc.getGeneratedVoices.useQuery({
    limit: PAGE_LIMIT,
    offset,
  });

  const generatedVoices = data?.generatedVoices || [];
  const count = data?.count || 0;

  const columnHelper = createColumnHelper<Data>();

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
        cell: (info) => info.renderValue(),
        header: () => "State",
      }),
      columnHelper.accessor("text", {
        header: () => <span>Text</span>,
      }),
      columnHelper.accessor("action", {
        header: () => <></>,
        cell: () => <Play className="cursor-pointer w-4 h-4 text-black" />,
      }),
    ];
  }, [selected, generatedVoices]);

  const isSelectedAll = useMemo(() => {
    return selected.length === generatedVoices?.length;
  }, [selected, generatedVoices]);

  const onSelect = (data: Data) => {
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

  return (
    <div className="w-full">
      <div className="mb-4 text">
        <Button
          disabled={selected.length === 0}
          className="mr-2"
          variant="premium"
        >
          Download selected
        </Button>
        <Button disabled={selected.length === 0} variant="destructive">
          Remove selected
        </Button>
      </div>
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
  );
};

export default HistoryTable;
