import { Group, Text } from "@progress/kendo-drawing";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartSeriesItemProps,
  ChartValueAxisItemProps,
  RenderEvent,
  PlotAreaClickEvent,
  ChartPanes,
  ChartPane,
  ValueAxisLabels,
} from "@progress/kendo-react-charts";
import {
  DateRangePicker,
  DateRangePickerChangeEvent,
} from "@progress/kendo-react-dateinputs";

import "hammerjs";
import { round } from "lodash";
import { useState } from "react";
import { getDataPoints } from "./getDataPoints";
import dayjs from "dayjs";

const TEMPERATURE_UM_CELCIUS = "°C";
const FANSPEED_UM = "CMS";
const PRESSURE_UM = "kPa";

// these must match the fields of our datapoint !.
const PRESSURE = "pressure";
const FAN_SPEED = "fanSpeed";
const TEMPERATURE = "temperature";
const INDOOR_TEMPERATURE = "indoorTemperature";
const HUMIDITY = "humidity";
const ON_OFF = "onOff";
const IN_DEFROST_STATE = "inDefrostState";

const BOOLEAN_TYPE_SERIE_HEIGHT = 25;
const DATAPOINTS_DAYS = 60;
const DATAPOINTS_INTERVAL_MINUTES = 30;
const dataPoints = getDataPoints(DATAPOINTS_DAYS, DATAPOINTS_INTERVAL_MINUTES);
console.log({ dataPoints });
const categories: Date[] = dataPoints.map((x) => x.date);

// const markerTimestamps = [
//   categories[Math.floor(categories.length / 3)],
//   categories[Math.floor(categories.length / 2)],
//   categories[Math.floor(categories.length / 0.75)],
// ];

// const markerDataPoints = categories.map((timestamp) => {
//   if (markerTimestamps.includes(timestamp))
//     return { marker: 1, extremum: "test" };
//   return { marker: 0 };
// });

const plotBands = [
  {
    from: categories[Math.floor(categories.length / 4)],
    to: categories[Math.floor(categories.length / 2)],
    color: "#ff3434d4",
    opacity: 0.4,
  },
];

// Add extra series with only 0 values.

const roundToDecimal = (number: number, decimal?: number) =>
  round(number, decimal);

const series: Array<ChartSeriesItemProps & { isBooleanTypeSerie?: boolean }> = [
  {
    type: "line",
    data: dataPoints,
    field: TEMPERATURE,
    name: `Temperature [${TEMPERATURE_UM_CELCIUS}]`,
    color: "#ff1c1c",
    axis: TEMPERATURE,
    aggregate: "avg",
    visible: true,
  },
  {
    type: "line",
    data: dataPoints,
    field: INDOOR_TEMPERATURE,
    name: `Temperature [${TEMPERATURE_UM_CELCIUS}]`,
    color: "#ff771c",
    axis: TEMPERATURE,
    aggregate: "avg",
    visible: true,
  },
  {
    type: "line",
    data: dataPoints,
    field: PRESSURE,
    name: `Pressure [${PRESSURE_UM}]`,
    color: "#2463e1",
    axis: PRESSURE,
    aggregate: "avg",
    visible: true,
  },
  {
    type: "line",
    data: dataPoints,
    field: FAN_SPEED,
    name: `Fan Speed [${FANSPEED_UM}]`,
    color: "#ab36ff60",
    axis: FAN_SPEED,
    aggregate: "avg",
    visible: true,
  },
  {
    type: "line",
    data: dataPoints,
    field: HUMIDITY,
    name: `Humidity [%]`,
    color: "#e8ff36",
    axis: HUMIDITY,
    aggregate: "avg",
    visible: true,
  },
  {
    type: "area",
    data: dataPoints,
    field: ON_OFF,
    name: `ON/OFF`,
    color: "#ff8a36",
    axis: ON_OFF,
    line: { style: "step" },
    aggregate: "max",
    isBooleanTypeSerie: true,
    missingValues: "gap",
    visible: true,
  },
  {
    type: "area",
    data: dataPoints,
    field: IN_DEFROST_STATE,
    name: `InDefrostState`,
    color: "#36a8ff",
    axis: IN_DEFROST_STATE,
    line: { style: "step" },
    aggregate: "max",
    isBooleanTypeSerie: true,
    missingValues: "gap",
    visible: true,
  },
  // {
  //   data: markerDataPoints,
  //   field: "marker",
  //   name: "Markers",
  //   noteTextField: "extremum",
  //   notes: {
  //     label: {
  //       position: "outside",
  //     },
  //     line: {
  //       length: 300,
  //     },
  //     icon: {
  //       type: "square",
  //     },
  //     position: "top",
  //   },
  // },
];

const valueAxis: ChartValueAxisItemProps[] = [
  // {
  //   name: "markers",
  //   min: 0,
  //   max: 1,
  //   minorUnit: 0,
  //   majorUnit: 1,
  //   visible: false

  // },
  {
    name: TEMPERATURE,
    pane: "lineChartsPane",
    visible: true,
    labels: {
      content: (e: any) => {
        return `${roundToDecimal(e.value, 1)} ${TEMPERATURE_UM_CELCIUS}`;
      },
    } as ValueAxisLabels,
  },
  {
    name: PRESSURE,
    pane: "lineChartsPane",
    visible: true,
    labels: {
      content: (e: any) => `${roundToDecimal(e.value)} ${PRESSURE_UM}`,
    },
  },
  {
    name: FAN_SPEED,
    pane: "lineChartsPane",
    labels: {
      content: (e: any) => `${roundToDecimal(e.value)} ${FANSPEED_UM}`,
    },
  },
  {
    name: HUMIDITY,
    pane: "lineChartsPane",
    visible: true,
    labels: {
      content: (e: any) => `${roundToDecimal(e.value)} %`,
    },
  },
  {
    name: ON_OFF,
    visible: true,
    pane: ON_OFF,
    majorGridLines: { visible: false },
    majorTicks: { visible: false },
    labels: {
      visible: true,
      content: (e) => (e.value === 0.5 ? ON_OFF : ""),
    },
    min: 0,
    max: 1,
    majorUnit: 0.5,
  },
  {
    name: IN_DEFROST_STATE,
    visible: true,
    pane: IN_DEFROST_STATE,
    majorGridLines: { visible: false },
    majorTicks: { visible: false },
    // labels: { visible: false },
    labels: {
      visible: true,
      content: (e) => (e.value === 0.5 ? IN_DEFROST_STATE : ""),
    },
    min: 0,
    max: 1,
    majorUnit: 0.5,
  },
];

function getStartAndEndOfDay(date: Date): { start: Date; end: Date } {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );

  return { start: startOfDay, end: endOfDay };
}

const today = new Date();

const defaultDateRangePickValue = {
  start: today,
  end: today,
};

const pastDate = new Date(
  today.getTime() - DATAPOINTS_DAYS * 24 * 60 * 60 * 1000
);
const { start: minDateRangePickerValue } = getStartAndEndOfDay(pastDate);
const { end: maxDateRangePickerValue } = getStartAndEndOfDay(today);

export const SimpleChart = () => {
  const [selectedDate, setSelectedDate] = useState<{
    start?: Date;
    end?: Date;
  }>(() => getStartAndEndOfDay(today));

  const onRender = (event: RenderEvent) => {
    const chart = event.target.chartInstance;
    if (!chart) {
      return;
    }

    //// Doesn't work yet with panning & zooming
    // const marker1Timestamp = categories[Math.floor(categories.length / 2)];
    // drawMarkerOnTimestamp(marker1Timestamp);
    // function drawMarkerOnTimestamp(markerDate: Date) {
    //   // get the axes
    //   const valueAxis = chart.findAxisByName(TEMPERATURE);
    //   const categoryAxis = chart.findAxisByName("categoryAxis");

    //   console.log(categoryAxis);
    //   console.log(valueAxis);

    //   // get the coordinates of the value at which the plot band will be rendered
    //   const catergorySlot = categoryAxis.slot(markerDate);
    //   console.log(catergorySlot);

    //   // get the coordinates of the entire category axis range
    //   const range = valueAxis.range();
    //   const valueSlot = valueAxis.slot(range.min, range.max);
    //   console.log({ valueSlot });
    //   // draw the plot band based on the found coordinates
    //   const line = new Path({
    //     stroke: {
    //       color: "#5e5e5e",
    //       width: 1,
    //     },
    //   })
    //     .moveTo(catergorySlot.origin.x, catergorySlot.origin.y)
    //     .lineTo(catergorySlot.origin.x, valueSlot.origin.y - 20);

    //   const label = new Text(
    //     "Marker1: " + marker1Timestamp.toUTCString(),
    //     [0, 0],
    //     {
    //       fill: {
    //         color: "red",
    //       },
    //       font: "14px sans",
    //     }
    //   );
    //   const bbox = label.bbox();
    //   label.position([
    //     catergorySlot.origin.x + 2,
    //     valueSlot.origin.y - bbox.size.height,
    //   ]);

    //   const group = new Group();
    //   group.append(line, label);

    //   // draw on the surface
    //   chart.surface.draw(group);
    // }

    // Draw the names of the boolean type bars to the left of the bar
    // drawBooleanTypeSerieNames();

    function drawBooleanTypeSerieNames() {
      const group = new Group();
      series.forEach((element) => {
        if (element.isBooleanTypeSerie) {
          const valueAxis = chart.findAxisByName(element.axis);
          const label = new Text(element.name || "", [0, 0], {
            fill: {
              color: "#424242",
            },
          });
          const bbox = label.bbox();

          // positioning isn't optimal yet. This should be dependent on the height we set for the bars
          label.position([
            valueAxis.slot().origin.x - (bbox.size.width + 20),
            valueAxis.slot().origin.y - bbox.size.height,
          ]);
          group.append(label);
        }
      });

      chart.surface.draw(group);
    }
  };

  const onPlotAreaClick = (event: PlotAreaClickEvent) => {};

  const handleCheckboxClick = (axis: string, value: boolean) => {
    console.log(axis, value);
    // toggle the visible property of the serie and valueAxis
  };

  const handleDateChange = (event: DateRangePickerChangeEvent) => {
    console.log("handleDateChange", event.value);
    if (!!event.value.start && !!event.value.end) {
      const { start } = getStartAndEndOfDay(event.value.start);
      const { end } = getStartAndEndOfDay(event.value.end);
      setSelectedDate({ start, end });
    }
  };

  const booleanChartPanes = series
    .filter((x) => x.isBooleanTypeSerie)
    .map((item, idx) => (
      <ChartPane
        key={idx}
        name={item.axis}
        height={BOOLEAN_TYPE_SERIE_HEIGHT}
      />
    ));
  const chartPanes = [
    <ChartPane key="lineChartsPane" name="lineChartsPane"></ChartPane>,
    ...booleanChartPanes,
    <ChartPane key="placeholderPane" name="placeholderPane" height={20} />,
    <ChartPane key="placeholderPane2" name="placeholderPane2" height={20} />,
  ];

  const setDateRange = (days: number) =>
    setSelectedDate({
      start: dayjs().subtract(days, "day").toDate(),
      end: today,
    });

  return (
    <>
      {/* <div>
        {series.map((el, idx) => {
          return (
            <div key={idx}>
              <input
                type="checkbox"
                defaultChecked={true}
                onClick={(event) =>
                  handleCheckboxClick(el.axis!, event.currentTarget.checked)
                }
              ></input>
              <label>{el.name}</label>
            </div>
          );
        })}
      </div> */}

      <div>
        <DateRangePicker
          min={minDateRangePickerValue}
          max={maxDateRangePickerValue}
          defaultValue={defaultDateRangePickValue}
          onChange={handleDateChange}
        />
      </div>
      <div>
        LAST: 
        {Array.from(Array(12)).map((x, idx) => <button onClick={() => setDateRange(idx)}>{++idx} DAY</button>)}
        <button onClick={() => setDateRange(30)}>30 DAY</button>
      </div>
      <Chart
        transitions={true} // put to false if needed
        onPlotAreaClick={onPlotAreaClick}
        onRender={onRender}
        pannable={{
          lock: "y",
        }}
        zoomable={{
          mousewheel: {
            lock: "y",
          },
        }}
      >
        <ChartPanes>{chartPanes}</ChartPanes>
        <ChartSeries>
          {series.map((item, idx) => (
            <ChartSeriesItem key={idx} {...item} />
          ))}
        </ChartSeries>
        <ChartCategoryAxis>
          {[
            <ChartCategoryAxisItem
              key={1}
              pane="placeholderPane" // take the last pane
              name="categoryAxis2"
              categories={categories}
              // maxDivisions={12} // labels on the axis
              // maxDateGroups={5} // points on the chart
              baseUnit="fit"
              // baseUnitStep="auto"
              visible={true}
              min={selectedDate.start}
              max={selectedDate.end}
            />,
            // <ChartCategoryAxisItem
            //   key={0}
            //   pane="lineChartsPane"
            //   name="categoryAxis"
            //   categories={categories}
            //   type="date"
            //   plotBands={plotBands}
            //   visible={false}
            // />,
            // <ChartCategoryAxisItem
            //   key={1}
            //   pane="placeholderPane2" // take the last pane
            //   name="categoryAxis3"
            //   categories={categories}
            //   // maxDivisions={10}
            //   // maxDateGroups={30}
            //   baseUnit="days"
            //   // baseUnitStep="auto"
            //   visible={true}
            //   min={selectedDate.start}
            //   max={selectedDate.end}
            //   majorGridLines={{ visible: false }}
            //   minorGridLines={{ visible: false }}
            // />,
          ]}
        </ChartCategoryAxis>
        <ChartValueAxis>
          {valueAxis.map((item, idx) => (
            <ChartValueAxisItem key={idx} {...item} />
          ))}
        </ChartValueAxis>
        <ChartLegend
          visible={true}
          position="right"
          orientation="vertical"
        ></ChartLegend>
      </Chart>
      <br></br>
      <div>
        ERROR ZONE: {plotBands[0] && plotBands[0].from.toUTCString()} -{" "}
        {plotBands[0].to.toUTCString()}
      </div>
    </>
  );
};
