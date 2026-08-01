export function shotAt(exif: Record<string, any> | null | undefined, now = Date.now()): number {
  const parts = String(exif?.DateTimeOriginal ?? '').match(/\d+/g);

  if (parts?.length !== 6) return now;
  
  const [year, month, day, hour, minute, second] = parts.map(Number);
  return new Date(year, month - 1, day, hour, minute, second).getTime();
}
