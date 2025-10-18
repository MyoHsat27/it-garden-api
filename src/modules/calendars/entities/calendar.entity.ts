export enum EventType {
  CLASS = 'class',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  type: EventType;
  batchName: string;
  teacherName?: string;
  classroom?: string;
}
