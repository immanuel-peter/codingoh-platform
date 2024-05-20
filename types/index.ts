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
  owner: Coder;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  github?: string;
  status?: string;
  project_image?: string;
  stack?: string[];
  skills?: string[];
  application?: string;
}

export interface Social {
  social: string;
  link: string;
}

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
