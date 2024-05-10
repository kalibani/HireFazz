export enum fileExtension {
  'pdf',
  'csv',
  'docx',
  'doc',
}

export enum UploadStatus {
  PENDING,
  PROCESSING,
  FAILED,
  SUCCESS,
}

export type fileTypes = {
  id: string;
  name: string;
  uploadStatus: UploadStatus;
  url: string;
  key: string;
  reportOfAnalysis?: JSON | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
};

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface ParamsProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string };
}
