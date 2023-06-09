import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { SimpleChart } from "./charts/SimpleChart";
import Tippy, { TippyProps } from "@tippyjs/react/headless";

const usePolling = (apiEndpoint: string, interval = 2000) => {
  const [data, setData] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let timerId: number | undefined;

    const fetchData = async () => {
      try {
        console.log("fetched Data");
        const response = await fetch(apiEndpoint);
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (isPolling) {
      fetchData();
      timerId = setInterval(fetchData, interval);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [apiEndpoint, interval, isPolling]);

  const startPolling = () => {
    setIsPolling(true);
  };

  const stopPolling = () => {
    setIsPolling(false);
  };

  return {
    data,
    isPolling,
    startPolling,
    stopPolling,
  };
};

// Usage
function App() {
  // const { data, isPolling, startPolling, stopPolling } =
  //   usePolling("your-api-endpoint");

  return (
    <>
      {/* <div>
        {isPolling ? (
          <button onClick={stopPolling}>Stop Polling</button>
        ) : (
          <button onClick={startPolling}>Start Polling</button>
        )}

        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div> */}
      <SimpleChart></SimpleChart>
    </>
  );
}

export default App;
