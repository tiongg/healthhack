export async function downloadFile(downloadUrl: string, fileName: string) {
  const response = await fetch(downloadUrl);
  const blob: Blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}
