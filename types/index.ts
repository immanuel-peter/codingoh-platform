import { StaticImageData } from "next/image";

// dummy/questions.ts
export interface Question {
  id: number;
  question: string;
  asker: User;
  description: string;
  time: string;
  date: string;
  isAnswered: boolean;
  answer?: string;
  contributors?: Contributor[];
  tags?: string[];
}

export interface User {
  id: number;
  name: string;
  about?: string;
  email: string;
  position?: string;
  fileAttachments?: string[];
  codingLanguages?: Proficiency[];
  isOnline: boolean;
  location?: string;
  company?: string;
  skills?: string[];
  education?: string;
  platforms?: string[];
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
  user: User;
  contributionTime: string;
}

export interface Project {
  id: number;
  owner: User;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  github?: string;
  status: "ongoing" | "completed" | "on_hold";
  image: string;
  stack?: string[];
  needed?: string[];
  application?: string;
}

export interface Social {
  name: string;
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
  randUser: User;
  randName: string;
  randQuestion: string;
  link: string;
  unread: boolean;
}
