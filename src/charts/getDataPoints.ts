const randomIntegerNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// const randomNullor1Value = () => null;
const randomNullor1Value = () => (randomIntegerNumberBetween(0, 1) ? 1 : null);

const getRandomBoolean = () => Math.random() < 0.5;

function roundDownToNearestMinutes(date: Date, roundDownMinutes: number) {
  const minutes = date.getMinutes();
  date.setSeconds(0);
  date.setMilliseconds(0);

  if (minutes < roundDownMinutes) {
    date.setMinutes(0);
  } else {
    date.setMinutes(roundDownMinutes);
  }

  return date;
}


export const getDataPoints = (days = 30, intervalMinutes = 30) => {
  const endDate = roundDownToNearestMinutes(new Date(), intervalMinutes); 
  console.log(endDate)
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000); 
  console.log(startDate);
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
      temperature: randomIntegerNumberBetween(-30, 30),
      indoorTemperature: randomIntegerNumberBetween(40, 70),
      pressure: randomIntegerNumberBetween(700, 1200),
      fanSpeed: randomIntegerNumberBetween(100, 400),
      humidity: randomIntegerNumberBetween(0, 100),
      onOff: randomNullor1Value(),
      inDefrostState: randomNullor1Value(),
      // inWarningState: randomNullor1Value(),
    });
  }

  console.log(dataPoints);
  return dataPoints;
};

