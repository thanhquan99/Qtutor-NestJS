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
  COMPLETED = 'Completed',
  CANCEL = 'Cancel',
}

export enum NotificationExtraType {
  TUTOR_STUDENT = 'Tutor Student',
}

export enum NotificationType {
  EDIT = 'Edit',
  READ_ONLY = 'Read Only',
}
