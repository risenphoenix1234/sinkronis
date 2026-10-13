// src/components/payroll/payee-edit/utils.ts
export const dateOnly = (value: string | null | undefined) => (value ? value.slice(0, 10) : "");

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};