export function varStatus() {
    return Math.random() > 0.5;
}

export function parseDateString(dateString: string): Date {
    const months: { [key: string]: number } = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
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
    const daysDifference = Math.abs(Math.round(timeDifference / oneDayInMilliseconds));
  
    return daysDifference;
  }
  