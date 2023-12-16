// components/CSVRenderer
"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { DataTable } from "./table/data-table";
import { columnFormatter } from "./table/columns";

import { ColumnDef } from "@tanstack/react-table";

interface CSVRendererProps {
  url: string;
}

const CSVRenderer = ({ url }: CSVRendererProps) => {
  const [data, setData] = useState<string[][]>([]);
  const [columns, setColumns] = useState<ColumnDef<string[], unknown>[]>([]);

  const handleFetchCSV = () => {
    try {
      const file = url;

      Papa.parse<string[]>(file, {
        header: true,
        download: true, // use a web worker so that the page doesn't hang up
        complete({ data }) {
          setData(data);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchCSV();
  }, []);

  const formatter = (data: string[][]) => {
    const result = columnFormatter(data);
    // @ts-ignore
    setColumns(result);
  };

  useEffect(() => {
    formatter(data);
  }, [data]);

  return (
    <>
      {data?.length > 0 && columns?.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default CSVRenderer;
