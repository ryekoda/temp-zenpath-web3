// app/[id]/reports/_utils/reportHeaderHelpers.ts

/**
 * Calculates the number of headers currently hidden based on the user's workspace settings configuration.
 * @param companySettings - The raw company settings object containing header metadata visibility keys.
 * @returns number - The count of columns set to hidden.
 */
export function NumberOfHiddenHeaders(companySettings: any): number {
  if (!companySettings || !companySettings.headers) return 0;
  
  // Assuming headers are stored as an object or array where a property denotes hidden status
  // Adjust this internal filter condition to match your exact DB schema structure
  const hiddenCount = Object.values(companySettings.headers).filter(
    (header: any) => header.isHidden === true || header.visible === false
  ).length;

  return hiddenCount;
}

/**
 * Triggers the native browser print sequence window, automatically styling the target page 
 * based on your Tailwind media print rules ('print:block', 'print:hidden').
 */
export function PrintButtonPressed(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}