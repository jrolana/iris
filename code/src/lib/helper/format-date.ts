import { differenceInCalendarDays, isToday } from "date-fns";

export const toSupabaseDateTime = (date: Date) => date.toISOString();

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

export const smart = (iso: string) => {
  const d = new Date(iso);
  return isToday(d) ? `Today at ${formatTime(iso)}` : formatDateTime(iso);
}
