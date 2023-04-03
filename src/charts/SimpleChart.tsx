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
} from "@progress/kendo-react-charts";

import "hammerjs";
import { round } from "lodash";
import { getDataPoints } from "./getDataPoints";

const TEMPERATURE_UMCELCIUS = "°C";
const FANSPEED_UM = "CMS";
const PRESSURE_UM = "kPa";
const AXIS_PRESSURE = "pressure";
const AXIS_FAN = "fan";
const AXIS_TEMPERATURE = "temperature";
const AXIS_HUMIDITY = "humidity";

const dataPoints = getDataPoints(60);
const categories = dataPoints.map((x) => x.date);

const plotBand = [categories[1000], categories[2000]];

const roundToDecimal = (number: number, decimal?: number) =>
  round(number, decimal);

export const SimpleChart = () => {
  const series: ChartSeriesItemProps[] = [
    {
      type: "line",
      data: dataPoints,
      field: "temperature",
      name: `Temperature [${TEMPERATURE_UMCELCIUS}]`,
      color: "#ff1c1c",
      axis: AXIS_TEMPERATURE,
      noteTextField: "hello",
    },
    {
      type: "line",
      data: dataPoints,
      field: "pressure",
      name: `Pressure [${PRESSURE_UM}]`,
      color: "#2463e1",
      axis: AXIS_PRESSURE,
    },
    {
      type: "bar",
      data: dataPoints,
      field: "fanSpeed",
      name: `Fan Speed [${FANSPEED_UM}]`,
      color: "#ab36ff60",
      axis: AXIS_FAN,
    },
    {
      type: "line",
      data: dataPoints,
      field: "humidity",
      name: `Humidity [%]`,
      color: "#e8ff36",
      axis: AXIS_HUMIDITY,
    },
  ];

  const valueAxis: ChartValueAxisItemProps[] = [
    {
      name: AXIS_TEMPERATURE,
      // min: 0,
      max: undefined,
      labels: {
        content: (e: any) =>
          `${roundToDecimal(e.value, 1)} ${TEMPERATURE_UMCELCIUS}`,
      },
    },
    {
      name: AXIS_PRESSURE,
      // min: 0,
      max: undefined,
      labels: {
        content: (e: any) => `${roundToDecimal(e.value)} ${PRESSURE_UM}`,
      },
      // visible: false
    },
    {
      name: AXIS_FAN,
      // min: 0,
      max: undefined,
      labels: {
        content: (e: any) => `${roundToDecimal(e.value)} ${FANSPEED_UM}`,
      },
    },
    {
      name: AXIS_HUMIDITY,
      // min: 0,
      max: undefined,
      labels: {
        content: (e: any) => `${roundToDecimal(e.value)} %`,
      },
    },
  ];

  const onRender = (event: RenderEvent) => {
    const chart = event.target.chartInstance;
    if (!chart) {
      return;
    }
    // get the axes
    drawMarker(categories[3000]);

    function drawMarker(markerDate: Date) {
      const valueAxis = chart.findAxisByName(AXIS_TEMPERATURE);
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

      const label = new Text("Marker1", [0, 0], {
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
        <ChartSeries>
          {series.map((item, idx) => (
            <ChartSeriesItem key={idx} {...item} aggregate="avg" />
          ))}
        </ChartSeries>
        <ChartCategoryAxis>
          <ChartCategoryAxisItem
            name="categoryAxis"
            categories={categories}
            maxDivisions={10}
            maxDateGroups={30}
            baseUnit="auto"
            baseUnitStep="auto"
            axisCrossingValue={[0, 0, 0]}
            plotBands={[
              {
                from: plotBand[0],
                to: plotBand[1],
                color: "#ff2424",
                opacity: 0.4,
              },
            ]}
          />
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
      <br></br>
      <br></br>
      {/* <table>
        <thead>
        <tr>
            <th>Timestamp</th>
            <th>Temperature</th>
            <th>Pressure</th>
            <th>Fanspeed</th>
            <th>Humidity</th>
            </tr>
            </thead>
            <tbody>
          {dataPoints.map((x, idx) => (
            <tr key={idx}>
            <td>{x.date.toUTCString()}</td>
            <td>{x.temperature}</td>
            <td>{x.pressure}</td>
            <td>{x.fanSpeed}</td>
            <td>{x.humidity}</td>
            </tr>
            ))}
            </tbody>
          </table> */}
    </>
  );
};
