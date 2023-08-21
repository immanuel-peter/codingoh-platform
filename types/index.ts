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
  contributors: Contributor[];
}

export interface User {
  id: number;
  name: string;
  about: string;
  email: string;
  position: string;
  fileAttachments: string[];
  codingLanguages: Proficiency[];
  isOnline: boolean;
  location: string;
  company: string;
  skills: string[];
  education: string;
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
  status: "ongoing" | "completed" | "on_hold";
}
