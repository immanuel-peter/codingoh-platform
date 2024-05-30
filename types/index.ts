import { StaticImageData } from "next/image";

// dummy/questions.ts
export interface Question {
  id: number;
  created_at?: Date | string;
  asker: Coder;
  question: string;
  tags?: string[];
  description: string;
  answer_preference: string;
  notify_email: boolean;
  notify_desktop: boolean;
  answer?: string;
  artificial_date?: Date | null;
  contributors?: Contributor[];
}

export interface Coder {
  id: number;
  created_at?: Date | string;
  first_name: string;
  last_name: string;
  gender?: string;
  birthday?: string;
  timezone: string;
  email_address: string;
  company?: string;
  position?: string;
  city?: string;
  us_state?: string;
  country?: string;
  about?: string;
  background_image?: number;
  skills?: string[];
  socials?: Social[];
  stack?: Proficiency[];
  education?: string;
  auth_id: string;
  profile_image: boolean;
}

export interface UserType {
  id: number;
  name: string;
  gender?: string;
  dob?: string;
  timezone: string;
  email: string;
  education?: string;
  company?: string;
  position?: string;
  city?: string;
  usState?: string;
  country?: string;
  profileImg?: string;
  about?: string;
  backgroundImg?: StaticImageData;
  stack?: Proficiency[];
  skills?: string[];
  socials?: Social[];
}

export interface Proficiency {
  language: string;
  proficiency: number;
}

export interface Contributor {
  id: number;
  created_at?: Date | string;
  question_id: Question;
  user_id: Coder;
}

export interface Project {
  id: number;
  created_at: Date | string;
  owner: Coder | null;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  github?: string;
  status: string;
  project_image?: boolean;
  stack?: string[];
  skills?: string[];
  application?: string;
}

export interface Social {
  social: string;
  link: string;
}

export interface Comment {
  id: number;
  created_at: Date | string;
  parent_comment: Comment | null;
  commenter: Coder;
  is_answer: boolean;
  likes: number;
  question: Question;
  text: string;
  replies?: Comment[];
  level?: number;
}

export interface Scheduling {
  id: number;
  created_at: string;
  scheduler_id: Coder;
  receiver_id: Coder;
  scheduled_time: string;
  sender_note: string;
  status: string | null;
  receiver_note: string | null;
  meeting_id: number | null;
  meeting_uuid: string | null;
  meeting_start_url: string | null;
  meeting_join_url: string | null;
  meeting_password: string | null;
  question_id: Question;
  [key: string]: any;
}

/*
[
  {
    "id": 1,
    "created_at": "2024-05-27 04:47:16.585211+00",
    "scheduler_id": 59,
    "receiver_id": 93,
    "scheduled_time": "2024-05-31 20:15:00+00",
    "sender_note": "I am learning C++ right now.",
    "status": null,
    "receiver_note": null,
    "meeting_id": null,
    "meeting_uuid": null,
    "meeting_start_url": null,
    "meeting_join_url": null,
    "meeting_password": null,
    "question_id": 22,
    "is_done": false,
    "is_confirmed": false
  }
]
*/

// app/users/[id]/page.tsx
export interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

export interface Tag {
  value: string;
  label: string;
}

export interface InboxIem {
  randUser: Coder;
  randName: string;
  randQuestion: string;
  link: string;
  unread: boolean;
}
