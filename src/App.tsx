import { SimpleChart } from "./charts/SimpleChart";
// import { StockChartt } from "./charts/stockchart/StockChart";

function App() {
  return (
    <>
      <div>
        <input type="checkbox"></input>
        <label>Error zone</label>
      </div>
      <div>
        <input type="checkbox"></input>
        <label>Zoom & Pan</label>
      </div>
      <div>
        <input type="checkbox"></input>
        <label>Aggregate data</label>
      </div>
      <div>
        <input type="checkbox"></input>
        <label>Tooltips</label>
      </div>
      <div>
        <input type="checkbox"></input>
        <label>Multiple Axes</label>
      </div>
      <div>
        <input type="checkbox"></input>
        <label>Markers</label>
      </div>
      <br></br>
      <SimpleChart></SimpleChart>
      {/* <StockChartt></StockChartt> */}
    </>
  );
}

export default App;
