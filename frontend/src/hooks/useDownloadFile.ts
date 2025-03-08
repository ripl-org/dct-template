import { useState } from 'react';

type DownloadFileHookReturnType = {
  loading: boolean;
  error: string | null;
  downloadFile: (filename: string) => void;
};

const useDownloadFile = (): DownloadFileHookReturnType => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (filename: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/data-dct/${filename}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('An error occurred while downloading the file');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, downloadFile };
};

export default useDownloadFile;
