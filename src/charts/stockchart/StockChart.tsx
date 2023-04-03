import * as React from "react";
import {
  StockChart,
  ChartTitle,
  ChartSeries,
  ChartSeriesItem,
  ChartNavigator,
  ChartNavigatorSelect,
  ChartNavigatorSeries,
  ChartNavigatorSeriesItem,
  NavigatorFilterEvent,
} from "@progress/kendo-react-charts";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import "hammerjs";
import { getDataPoints } from "../getDataPoints";

const series = getDataPoints();
console.log(series);
const navigatorData = series;

export const StockChartt = () => {
  const [seriesData, setSeriesData] = React.useState(series);
  const [dateFilter, setDateFilter] = React.useState("");
  const onNavigatorChange = (event: NavigatorFilterEvent) => {
    const filters: FilterDescriptor | CompositeFilterDescriptor = {
      logic: "and",
      filters: [
        {
          field: "date",
          operator: "gte",
          value: event.from,
        },
        {
          field: "date",
          operator: "lt",
          value: event.to,
        },
      ],
    };
    console.log(event.from, event.to);
    setSeriesData(filterBy(navigatorData, filters));
    setDateFilter(`${event.from} - ${event.to}`);
  };
  return (
    <div>
      <div>Filter: {dateFilter}</div>
      <StockChart onNavigatorFilter={onNavigatorChange} partialRedraw={true}>
        <ChartSeries>
          <ChartSeriesItem
            data={seriesData}
            type="line"
            field="temperature"
            categoryField="date"
            aggregate="avg"
          />
        </ChartSeries>
        <ChartNavigator visible={false}>
          <ChartNavigatorSelect />
          <ChartNavigatorSeries>
            <ChartNavigatorSeriesItem
              data={navigatorData}
              type="line"
              field="temperature"
              categoryField="date"
            />
          </ChartNavigatorSeries>
        </ChartNavigator>
      </StockChart>
    </div>
  );
};
