const randomIntegerNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomNullor1Value = () => (randomIntegerNumberBetween(0, 1) ? 1 : null);

export const getDataPoints = (days = 30, intervalMinutes = 5) => {
  const startDate = new Date(); // Start from the current date and time
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000); // End date is one day from the start date
  const datesArray: Date[] = [];

  for (
    let date = startDate;
    date < endDate;
    date.setMinutes(date.getMinutes() + intervalMinutes)
  ) {
    datesArray.push(new Date(date));
  }

  datesArray.sort((a: Date, b: Date) => a.getTime() - b.getTime());

  const dataPoints = [];

  for (let idx = 0; idx < datesArray.length; idx++) {
    dataPoints.push({
      date: datesArray[idx],
      temperature: randomIntegerNumberBetween(0, 30),
      pressure: randomIntegerNumberBetween(700, 1200),
      fanSpeed: randomIntegerNumberBetween(100, 400),
      humidity: randomIntegerNumberBetween(0, 100),
      onOff: randomNullor1Value(),
      inDefrostState: randomNullor1Value(),
    });
  }

  return dataPoints;
};
