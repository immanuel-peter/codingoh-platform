export interface Question {
  question: string;
  asker: string;
  time: string;
  date: string;
}

export interface User {
  name: string;
  description: string;
}

// Questions
export const questions: Question[] = [
  {
    question: "How do I create a new thread in a forum?",
    asker: "John Doe",
    time: "10:30 AM",
    date: "July 23, 2023",
  },
  {
    question: "How do I format code in a post?",
    asker: "Jane Doe",
    time: "10:35 AM",
    date: "July 23, 2023",
  },
  {
    question: "What is the difference between a class and an object?",
    asker: "Peter Smith",
    time: "10:40 AM",
    date: "July 23, 2023",
  },
  {
    question: "How do I debug a JavaScript error?",
    asker: "Mary Jones",
    time: "10:45 AM",
    date: "July 23, 2023",
  },
  {
    question: "How do I create a REST API?",
    asker: "Susan Brown",
    time: "10:50 AM",
    date: "July 23, 2023",
  },
];

// Users
export const users: User[] = [
  {
    name: "John Doe",
    description:
      "I am a software engineer with 5 years of experience. I am interested in web development and machine learning.",
  },
  {
    name: "Jane Doe",
    description:
      "I am a student who is learning to code. I am interested in front-end development and web design.",
  },
  {
    name: "Peter Smith",
    description:
      "I am a senior software engineer with 10 years of experience. I am interested in distributed systems and cloud computing.",
  },
  {
    name: "Mary Jones",
    description:
      "I am a junior software engineer with 2 years of experience. I am interested in mobile development and big data.",
  },
  {
    name: "Susan Brown",
    description:
      "I am a self-taught developer who is interested in full-stack development. I am also interested in open source software.",
  },
];
