export function formatTimeAMPM(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time;

  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
