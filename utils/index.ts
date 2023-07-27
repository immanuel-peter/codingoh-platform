import { Proficiency, Question, User } from "@/types";

export function varStatus() {
  return Math.random() > 0.5;
}

export function parseDateString(dateString: string): Date {
  const months: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const dateParts = dateString.split(" ");
  const month = months[dateParts[0]];
  const day = parseInt(dateParts[1].replace(",", ""));
  const year = parseInt(dateParts[2]);

  return new Date(year, month, day);
}

export function daysBetweenDateAndToday(dateString: string): number {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Get the current date (today) and reset time to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse the target date string into a Date object and reset time to midnight
  const targetDate = parseDateString(dateString);
  targetDate.setHours(0, 0, 0, 0);

  // Calculate the difference in time between the target date and today
  const timeDifference = targetDate.getTime() - today.getTime();

  // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
  const daysDifference = Math.abs(
    Math.round(timeDifference / oneDayInMilliseconds)
  );

  return daysDifference;
}

export function stringifyList(array: string[] | number[]): any {
  if (typeof array[0] === "string") {
    let listString = array[0];
    for (let i = 1; i < array.length; i++) {
      listString += `, ${array[i]}`;
    }
    return listString;
  } else {
    let listString = `${array[0]}`;
    for (let i = 1; i < array.length; i++) {
      listString += `, ${array[i]}`;
    }
    return listString;
  }
}

export const getTopLanguages = (languages: Proficiency[]) => {
  // Sort the codingLanguages array based on proficiency in descending order
  const sortedLanguages = languages.sort(
    (a, b) => b.proficiency - a.proficiency
  );

  // Take the first 3 elements (highest proficiency) from the sorted array
  return sortedLanguages.slice(0, 3);
};

// Function to sort questions and contributions based on users
export const sortQuestionsAndContributions = (
  questions: Question[],
  users: User[]
) => {
  const userMap: {
    [userId: number]: {
      name: string;
      askedQuestions: Question[];
      contributedQuestions: Question[];
    };
  } = {};

  // Initialize the user map with empty arrays for each user
  users.forEach((user) => {
    userMap[user.id] = {
      name: user.name,
      askedQuestions: [],
      contributedQuestions: [],
    };
  });

  // Iterate through the questions and populate the user map
  questions.forEach((question) => {
    const askerId = question.asker.id;
    userMap[askerId].askedQuestions.push(question);

    question.contributors.forEach((contributor) => {
      const contributorId = contributor.user.id;
      userMap[contributorId].contributedQuestions.push(question);
    });
  });

  return userMap;
};
