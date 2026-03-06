import { differenceInCalendarDays, isToday, format } from "date-fns";

export const toSupabaseDate = (date: Date) => format(date, "yyyy-MM-dd");

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const fromSupabaseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d); // local date, no timezone shift
};

export const toSupabaseTimestamp = (d: Date) => d.toISOString();
export const fromSupabaseTimestamp = (s: string) => new Date(s);

export const formatTime = (date: string | Date) => 
  new Date(date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  })

export const formatDateTime = (date: string | Date) =>
  new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const daysDelayed = (targetISO: string) => {
  const diff = differenceInCalendarDays(new Date(), new Date(targetISO));
  return Math.max(diff, 0);
}

export const formatSmartDate = (iso: string) => {
  const d = new Date(iso);
  return isToday(d) ? `Today at ${formatTime(iso)}` : formatDateTime(iso);
}
