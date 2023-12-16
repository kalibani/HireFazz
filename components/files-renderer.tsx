"use client";

import SimpleBar from "simplebar-react";
import DocRenderer from "./docx-renderer";
import { fileExtension } from "@/types/types";
import CSVRenderer from "./csv-renderer";
interface filesRendererProps {
  url: string;
  fileExtension: fileExtension | string;
}

const filesRenderer = ({ url, fileExtension }: filesRendererProps) => {
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="flex-1 w-full h-[60vh] ">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-2rem)]">
          {fileExtension === "csv" ? (
            <CSVRenderer url={url} />
          ) : (
            <DocRenderer url={url} />
          )}
        </SimpleBar>
      </div>
    </div>
  );
};

export default filesRenderer;
