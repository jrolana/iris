export const toSupabaseDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

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
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

export const isToday = (date: string | Date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}
