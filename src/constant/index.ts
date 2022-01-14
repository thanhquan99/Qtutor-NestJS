export enum ROLE {
  SUPER_ADMIN = 'super-admin',
  CUSTOMER = 'customer',
  OPTIONAL = 'optional',
}

export const SALT = '$2b$10$leL65eC89pj8mWzejdSVbe';

export enum AcademicLevel {
  STUDENT = 'Student',
  COLLEGE_STUDENT = 'College Student',
  TEACHER = 'Teacher',
  MASTER = 'Master',
  PROFESSOR = 'Professor',
}

export enum TutorStudentStatus {
  WAITING_TUTOR_ACCEPT = 'Waiting Tutor Accept',
  WAITING_STUDENT_ACCEPT = 'Waiting Student Accept',
  ACCEPTED = 'Accepted',
  ARCHIVED = 'Archived',
  CANCEL = 'Cancel',
}

export enum NotificationExtraType {
  TUTOR_STUDENT = 'Tutor Student',
}

export enum NotificationType {
  EDIT = 'Edit',
  READ_ONLY = 'Read Only',
}

export enum ScheduleDays {
  SUNDAY = 2,
  MONDAY = 3,
  TUESDAY = 4,
  WEDNESDAY = 5,
  THURSDAY = 6,
  FRIDAY = 7,
  SATURDAY = 8,
}

export enum DefaultDate {
  YEAR = 2022,
  MONTH = 1,
}

export enum DaysOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export const HOURS_OF_DAY = [...Array(16).keys()].map((i) => i + 7);
export const MINUTES_OF_HOUR = [0, 15, 30, 45];
