"use client";

export const columnFormatter = (columns: string[][]) => {
  if (columns.length === 0) return;
  let headers;
  for (var key in columns) {
    const obj = columns[key];
    headers = Object.keys(obj);
  }
  let result = headers?.map((item) => ({
    accessorKey: item,
    header: item,
  }));
  return result;
};
