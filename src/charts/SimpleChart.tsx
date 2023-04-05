import { Group, Path, Text } from "@progress/kendo-drawing";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartSeriesItemProps,
  ChartValueAxisItemProps,
  ChartLegendItem,
  RenderEvent,
  PlotAreaClickEvent,
  ChartPanes,
  ChartPane,
  ValueAxisLabels,
} from "@progress/kendo-react-charts";

import "hammerjs";
import { round } from "lodash";
import { getDataPoints } from "./getDataPoints";

const TEMPERATURE_UMCELCIUS = "°C";
const FANSPEED_UM = "CMS";
const PRESSURE_UM = "kPa";
const PRESSURE = "pressure";
const FAN_SPEED = "fanSpeed";
const TEMPERATURE = "temperature";
const HUMIDITY = "humidity";
const ON_OFF = "onOff";
const IN_DEFROST_STATE = "inDefrostState";

const BOOLEAN_TYPE_BAR_HEIGHT = 30;

const dataPoints = getDataPoints(10, 30);
console.log(dataPoints);
const categories = dataPoints.map((x) => x.date);

const plotBand = [
  categories[Math.floor(categories.length / 4)],
  categories[Math.floor(categories.length / 2)],
];

const markerTimestamp = categories[Math.floor(categories.length / 2)];

const roundToDecimal = (number: number, decimal?: number) =>
  round(number, decimal);

export const SimpleChart = () => {
  const series: ChartSeriesItemProps[] = [
    {
      type: "line",
      data: dataPoints,
      field: TEMPERATURE,
      name: `Temperature [${TEMPERATURE_UMCELCIUS}]`,
      color: "#ff1c1c",
      axis: TEMPERATURE,
      noteTextField: "hello",
      aggregate: "avg",
    },
    {
      type: "line",
      data: dataPoints,
      field: PRESSURE,
      name: `Pressure [${PRESSURE_UM}]`,
      color: "#2463e1",
      axis: PRESSURE,
      aggregate: "avg",
    },
    {
      type: "line",
      data: dataPoints,
      field: FAN_SPEED,
      name: `Fan Speed [${FANSPEED_UM}]`,
      color: "#ab36ff60",
      axis: FAN_SPEED,
      aggregate: "avg",
    },
    {
      type: "line",
      data: dataPoints,
      field: HUMIDITY,
      name: `Humidity [%]`,
      color: "#e8ff36",
      axis: HUMIDITY,
      aggregate: "avg",
    },
    {
      type: "area",
      data: dataPoints,
      field: ON_OFF,
      name: `Onoff`,
      color: "#ff8a36",
      axis: ON_OFF,
      line: { style: "step" },
      aggregate: "max",
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
    },
  ];

  const valueAxis: ChartValueAxisItemProps[] = [
    {
      name: TEMPERATURE,
      visible: true,
      max: undefined,
      labels: {
        content: (e: any) =>
          `${roundToDecimal(e.value, 1)} ${TEMPERATURE_UMCELCIUS}`,
      },
    },
    {
      name: PRESSURE,
      visible: true,
      max: undefined,
      labels: {
        content: (e: any) => `${roundToDecimal(e.value)} ${PRESSURE_UM}`,
      },
    },
    {
      name: FAN_SPEED,
      max: undefined,
      labels: {
        content: (e: any) => `${roundToDecimal(e.value)} ${FANSPEED_UM}`,
      },
    },
    {
      name: HUMIDITY,
      visible: true,
      max: undefined,
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
      labels: { visible: false },
      min: 0,
      max: 1,
      minorUnit: 0,
      majorUnit: 1
    },
    {
      name: IN_DEFROST_STATE,
      visible: true,
      pane: IN_DEFROST_STATE,
      majorGridLines: { visible: false },
      majorTicks: { visible: false },
      labels: { visible: false },
      min: 0,
      max: 1,
      minorUnit: 0,
      majorUnit: 1
    },
  ];

  const onRender = (event: RenderEvent) => {
    const chart = event.target.chartInstance;
    if (!chart) {
      return;
    }


    //// Doesn't work yet with panning & zooming 
    // drawMarkerOnTimestamp(markerTimestamp);
    function drawMarkerOnTimestamp(markerDate: Date) {
      // get the axes
      const valueAxis = chart.findAxisByName(TEMPERATURE);
      const categoryAxis = chart.findAxisByName("categoryAxis");

      console.log(categoryAxis);
      console.log(valueAxis);

      // get the coordinates of the value at which the plot band will be rendered
      const catergorySlot = categoryAxis.slot(markerDate);
      console.log(catergorySlot);

      // get the coordinates of the entire category axis range
      const range = valueAxis.range();
      const valueSlot = valueAxis.slot(range.min, range.max);
      console.log({ valueSlot });
      // draw the plot band based on the found coordinates
      const line = new Path({
        stroke: {
          color: "#5e5e5e",
          width: 1,
        },
      })
        .moveTo(catergorySlot.origin.x, catergorySlot.origin.y)
        .lineTo(catergorySlot.origin.x, valueSlot.origin.y - 20);

      const label = new Text("Marker1: " + markerTimestamp.toUTCString(), [0, 0], {
        fill: {
          color: "red",
        },
        font: "14px sans",
      });
      const bbox = label.bbox();
      label.position([
        catergorySlot.origin.x + 2,
        valueSlot.origin.y - bbox.size.height,
      ]);

      const group = new Group();
      group.append(line, label);

      // draw on the surface
      chart.surface.draw(group);
    }
  };

  const onPlotAreaClick = (event: PlotAreaClickEvent) => {};

  return (
    <>
      <Chart
        onPlotAreaClick={onPlotAreaClick}
        onRender={onRender}
        pannable={true}
        zoomable={true}
      >
        <ChartTitle text="Multiple axes" />
        <ChartPanes>
          <ChartPane name="top"></ChartPane>
          <ChartPane name={ON_OFF} height={BOOLEAN_TYPE_BAR_HEIGHT} />
          <ChartPane name={IN_DEFROST_STATE} height={BOOLEAN_TYPE_BAR_HEIGHT} />
          <ChartPane name="emptyPane" height={20} />
        </ChartPanes>
        <ChartSeries>
          {series.map((item, idx) => (
            <ChartSeriesItem key={idx} {...item} />
          ))}
        </ChartSeries>
        <ChartCategoryAxis>
          {[
            // <ChartCategoryAxisItem
            //   key={0}
            //   pane="top"
            //   name="categoryAxis"
            //   categories={categories}
            //   maxDivisions={10}
            //   maxDateGroups={30}
            //   baseUnit="auto"
            //   baseUnitStep="auto"
            //   axisCrossingValue={[0, 0, 0]}
            //   plotBands={[
            //     {
            //       from: plotBand[0],
            //       to: plotBand[1],
            //       color: "#ff3434d4",
            //       opacity: 0.4,
            //     },
            //   ]}
            //   visible={false}
            // />,
            <ChartCategoryAxisItem
              key={1}
              pane="emptyPane" // take the last pane
              name="categoryAxis2"
              categories={categories}
              maxDivisions={10}
              maxDateGroups={30}
              baseUnit="auto"
              baseUnitStep="auto"
              axisCrossingValue={[0, 0, 0]}
            />,
          ]}
        </ChartCategoryAxis>
        <ChartValueAxis>
          {valueAxis.map((item, idx) => (
            <ChartValueAxisItem key={idx} {...item} />
          ))}
        </ChartValueAxis>
        <ChartLegend position="right" orientation="vertical"></ChartLegend>
      </Chart>
      <br></br>
      <div>
        ERROR ZONE: {plotBand[0].toUTCString()} - {plotBand[1].toUTCString()}
      </div>
    </>
  );
};
