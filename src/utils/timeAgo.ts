// lib/utils/timeAgo.ts
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "sec"],
    [60, "min"],
    [24, "hr"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];

  let value = seconds;
  let unit = "sec";

  for (const [divisor, label] of intervals) {
    if (value < divisor) {
      unit = label;
      break;
    }
    value = Math.floor(value / divisor);
    unit = label;
  }

  return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
}