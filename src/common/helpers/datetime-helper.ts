export function formatTimeAMPM(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time;

  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function resolveDateFromDayOfWeek(
  dayOfWeek: number,
  time: string,
): Date {
  const now = new Date();
  const currentDay = now.getDay(); // Sunday = 0
  const diff = (dayOfWeek - currentDay + 7) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + diff);

  const [hours, minutes] = time.split(':').map(Number);
  target.setHours(hours, minutes, 0, 0);

  return target;
}
