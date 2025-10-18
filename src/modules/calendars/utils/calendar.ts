import { Logger } from '@nestjs/common';
import { Timetable } from '../../timetables/entities';

export function generateTimetableOccurrences(
  timetable: Timetable,
  startDate: Date,
  endDate: Date,
): { start: Date; end: Date }[] {
  const occurrences: { start: Date; end: Date }[] = [];
  const day = timetable.dayOfWeek;
  const startTime = timetable.timeSlot.startTime;
  const endTime = timetable.timeSlot.endTime;

  const current = new Date(startDate);
  const currentEndDate = new Date(endDate);
  while (current <= currentEndDate) {
    if (current.getDay() === day) {
      occurrences.push({
        start: new Date(`${current.toISOString().split('T')[0]}T${startTime}`),
        end: new Date(`${current.toISOString().split('T')[0]}T${endTime}`),
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return occurrences;
}
