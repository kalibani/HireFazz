"use-client";

import React, { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

import { DataTable } from "./table/data-table";

type Props = {};

type Data = {
  id: string;
  voice: string;
  date: string;
  state: string;
  text: string;
  action: string;
};

const DUMMY_DATA: Data[] = [
  {
    id: "1",
    voice: "Charlie",
    date: "1/1/2024",
    state: "Success",
    text: "Some text...",
    action: "play",
  },
  {
    id: "2",
    voice: "Charlie",
    date: "1/1/2024",
    state: "Success",
    text: "Some text...",
    action: "play",
  },
  {
    id: "3",
    voice: "Charlie",
    date: "1/1/2024",
    state: "Success",
    text: "Some text...",
    action: "play",
  },
  {
    id: "4",
    voice: "Charlie",
    date: "1/1/2024",
    state: "Success",
    text: "Some text...",
    action: "play",
  },
  {
    id: "5",
    voice: "Charlie",
    date: "1/1/2024",
    state: "Success",
    text: "Some text...",
    action: "play",
  },
];

const HistoryTable = (props: Props) => {
  const [selected, setSelected] = useState<Data[]>([]);

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
          <Checkbox onCheckedChange={onSelectAll} checked={isSelectedAll} />
        ),
      }),
      columnHelper.accessor("voice", {
        cell: (info) => info.renderValue(),
        header: () => "Voice",
      }),
      columnHelper.accessor("date", {
        cell: (info) => <i>{info.getValue()}</i>,
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
      }),
    ];
  }, [selected]);

  const isSelectedAll = selected.length === DUMMY_DATA.length;

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
    } else setSelected(DUMMY_DATA);
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
        tableClassName="rounded-md border-r-gray-200/70 border-l-gray-200/70 border"
        tableHeaderClassName="bg-gray-300/30"
        tableHeadClassName="text-black font-bold"
        columns={columns}
        data={DUMMY_DATA}
        pageIndex={0}
        pageSize={10}
      />
    </div>
  );
};

export default HistoryTable;
