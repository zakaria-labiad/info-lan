export type DownloadItem = {
  name: string;
  size: string;
  href: string;
};

export type DownloadSection = {
  category: string;
  items: DownloadItem[];
};
