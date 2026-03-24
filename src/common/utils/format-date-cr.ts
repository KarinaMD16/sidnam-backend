export function formatDateToCostaRica(date: Date | string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(date));
}