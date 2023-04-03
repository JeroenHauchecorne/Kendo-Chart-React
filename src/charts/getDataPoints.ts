const randomNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getDataPoints = (days = 30) => {
  const startDate = new Date(); // Start from the current date and time
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000); // End date is one day from the start date
  const interval = 5; // Interval in minutes
  const datesArray: Date[] = [];

  for (
    let date = startDate;
    date < endDate;
    date.setMinutes(date.getMinutes() + interval)
  ) {
    datesArray.push(new Date(date));
  }

  datesArray.sort((a: Date, b: Date) => a.getTime() - b.getTime());

  const dataPoints = [];

  for (let idx = 0; idx < datesArray.length; idx++) {
    dataPoints.push({
      date: datesArray[idx],
      temperature: randomNumberBetween(0, 30),
      pressure: randomNumberBetween(700, 1200),
      fanSpeed: randomNumberBetween(100, 400),
      humidity: randomNumberBetween(0, 100),
    });
  }

  return dataPoints;
};
