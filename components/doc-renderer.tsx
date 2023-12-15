"use client";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "react-hot-toast";

import { useResizeDetector } from "react-resize-detector";

import SimpleBar from "simplebar-react";

interface DocRendererProps {
  url: string;
}

const DocRenderer = ({ url }: DocRendererProps) => {
  const { width, ref } = useResizeDetector();
  // const urlResponse = fetch(url);
  // console.log("url", urlResponse);

  const docs = [{ uri: url }];

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="flex-1 w-full max-h-[60vh]">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-13rem)]">
          <div ref={ref}>
            <DocViewer
              pluginRenderers={DocViewerRenderers}
              documents={docs}
              theme={{
                primary: "#5296d8",
                secondary: "#ffffff",
                tertiary: "#5296d899",
                textPrimary: "#ffffff",
                textSecondary: "#5296d8",
                textTertiary: "#00000099",
                disableThemeScrollbar: false,
              }}
              className="flex-1 w-full max-h-[60vh]"
            />
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default DocRenderer;
