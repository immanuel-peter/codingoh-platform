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

// app/users/[id]/page.tsx
export interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}
