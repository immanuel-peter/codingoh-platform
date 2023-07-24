import { varStatus } from "@/utils";

export interface Question {
  question: string;
  asker: User;
  time: string;
  date: string;
  isAnswered: boolean;
  contributors: Contributor[];
}

export interface User {
  name: string;
  about: string;
  email: string;
  position: string;
  fileAttachments: string[];
  codingLanguages: string[];
  isOnline: boolean;
}

export interface Contributor {
  user: User;
  contributionTime: string;
}

// Users
export const users: User[] = [
  {
    name: "John Doe",
    about:
      "I am a software engineer with 5 years of experience. I am interested in web development and machine learning.",
    email: "johndoe@example.com",
    position: "Software Engineer",
    fileAttachments: ["resume.pdf"],
    codingLanguages: ["JavaScript", "Python", "Java"],
    isOnline: varStatus(),
  },
  {
    name: "Jane Doe",
    about:
      "I am a student who is learning to code. I am interested in front-end development and web design.",
    email: "janedoe@example.com",
    position: "Student",
    fileAttachments: [],
    codingLanguages: ["HTML", "CSS", "JavaScript"],
    isOnline: varStatus(),
  },
  {
    name: "Peter Smith",
    about:
      "I am a senior software engineer with 10 years of experience. I am interested in distributed systems and cloud computing.",
    email: "petersmith@example.com",
    position: "Senior Software Engineer",
    fileAttachments: ["portfolio.pdf"],
    codingLanguages: ["Java", "Python", "Go"],
    isOnline: varStatus(),
  },
  {
    name: "Mary Jones",
    about:
      "I am a junior software engineer with 2 years of experience. I am interested in mobile development and big data.",
    email: "maryjones@example.com",
    position: "Junior Software Engineer",
    fileAttachments: ["cv.pdf"],
    codingLanguages: ["Swift", "Java", "Python"],
    isOnline: varStatus(),
  },
  {
    name: "Susan Brown",
    about:
      "I am a self-taught developer who is interested in full-stack development. I am also interested in open source software.",
    email: "susanbrown@example.com",
    position: "Full-Stack Developer",
    fileAttachments: ["projects.pdf"],
    codingLanguages: ["JavaScript", "Python", "Ruby"],
    isOnline: varStatus(),
  },
];

// Questions
export const questions: Question[] = [
  {
    question: "How do I create a new thread in a forum?",
    asker: users[0],
    time: "10:30 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    contributors: [{ user: users[0], contributionTime: "10:35 AM" }],
  },
  {
    question: "How do I format code in a post?",
    asker: users[1],
    time: "10:35 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    contributors: [{ user: users[4], contributionTime: "10:40 AM" }],
  },
  {
    question: "What is the difference between a class and an object?",
    asker: users[2],
    time: "10:40 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    contributors: [
      { user: users[2], contributionTime: "10:45 AM" },
      { user: users[0], contributionTime: "10:50 AM" },
    ],
  },
  {
    question: "How do I debug a JavaScript error?",
    asker: users[3],
    time: "10:45 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    contributors: [{ user: users[2], contributionTime: "10:50 AM" }],
  },
  {
    question: "How do I create a REST API?",
    asker: users[4],
    time: "10:50 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    contributors: [
      { user: users[4], contributionTime: "10:55 AM" },
      { user: users[0], contributionTime: "11:00 AM" },
      { user: users[1], contributionTime: "11:05 AM" },
    ],
  },
];
