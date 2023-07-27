// dummy/questions.ts
export interface Question {
  id: number;
  question: string;
  asker: User;
  time: string;
  date: string;
  isAnswered: boolean;
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
}

export interface Proficiency {
  language: string;
  proficiency: number;
}

export interface Contributor {
  user: User;
  contributionTime: string;
}
