import * as ics from "ics";

export const toIcsEvent = (event: {
  address: string;
  choose_date: string;
  contain: number;
  content: any;
  counts: number;
  course_id: number;
  course_lab_final_score: any;
  course_name: string;
  course_student_lab_id: number;
  dates: string; // "2025-02-27"
  final_score: any;
  gmt_create: number;
  gmt_modified: any;
  id: number;
  is_must: number;
  lab_final_score: any;
  lab_ids: string;
  lab_name: string;
  major: string;
  open_week: string;
  phone: string;
  select_week: string;
  student_gender: string;
  student_name: string;
  student_uid: string;
  teacher_id: string;
  teacher_name: string;
  term_id: number;
  time: number;
  times: string; //"10:00"
  total_score: any;
  week: number;
}): ics.EventAttributes => {
  return {
    title: event.lab_name,
    description: event.lab_name + ' @ '+event.course_name,
    start: [
      ...(event.dates.split("-").map(Number) as [number, number, number]),
      ...(event.times.split(":").map(Number) as [number, number]),
    ],
    duration: { hours: 2, minutes: 25 },// This number depends.
    location: event.address,
    status: "CONFIRMED",
    busyStatus: "BUSY",
    organizer: { name: event.teacher_name },
    attendees: [{ name: event.student_name }],
  };
};
