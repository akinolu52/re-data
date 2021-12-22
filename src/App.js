import {
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,
  Tooltip
} from "chart.js";
import { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import './App.css';
import customData from "./meta.json";
import { chatOptions, getDateValues, getValues, randomColor } from './utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);

  const [result, setResult] = useState({});

  const [chatData, setChatData] = useState(null);

  const getOptions = (key1, key2) => {
    const uniqueItems = new Set();
    const uniqueItemsData = [];

    for (const item of customData) {
      if (
        item.table_name.includes("orders") &&
        item[key1] &&
        item[key2] &&
        item.value
      ) {
        uniqueItems.add({
          metric: item[key1],
          column_name: item[key2]
        });
        const _res = {
          metric: item[key1],
          column_name: item[key2],
          value: item.value,
          time_window_end: item.time_window_end
        };
        uniqueItemsData.push(_res);

        const _result = {
          [`${item[key1]} ${item[key2]}`]: _res
        };

        setResult(_result);
      }
    }

    setData(uniqueItemsData);

    const uniqueItemsArr = Array.from(uniqueItems);

    return [
      ...new Map(
        uniqueItemsArr.map((item) => [JSON.stringify(item), item])
      ).values()
    ];
  };

  const getData = (option) => {
    const result = data.filter(
      (item) =>
        item.metric === option.metric &&
        item.column_name === option.column_name &&
        item.value !== "" &&
        item.time_window_end !== ""
    );

    return result;
  };

  useEffect(() => {
    const metricColumnName = getOptions("metric", "column_name");

    setOptions(metricColumnName);
  }, []);

  const handleSelect = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    if (selectedOption) {
      const result = getData(selectedOption);
      const valueArr = getValues(result, "value");
      const timeWindowEndArr = getDateValues(result, "time_window_end");

      const barChatData = {
        labels: timeWindowEndArr,
        datasets: [
          {
            label: `Data for metric=${selectedOption.metric} and column_name=${selectedOption.column_name}`,
            data: valueArr,
            backgroundColor: randomColor()
          }
        ]
      };
      setChatData(barChatData);
    }
  };

  return (
    <div className="App">
      <h1>Re_data</h1>

      <select onChange={handleSelect}>
        <option value="null">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={JSON.stringify(option)}>
            {option.metric}({option.column_name})
          </option>
        ))}
      </select>

      {chatData && <Bar options={chatOptions} data={chatData} />}
    </div>
  );
}

export default App;
