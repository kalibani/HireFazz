"use client";

interface DocRendererProps {
  url: string;
}

const DocRenderer = ({ url }: DocRendererProps) => {
  return (
    <div>
      <iframe
        src={"https://docs.google.com/viewer?url=" + url + "&embedded=true"}
        title="file"
        width="100%"
        height="600"
      ></iframe>
    </div>
  );
};

export default DocRenderer;
