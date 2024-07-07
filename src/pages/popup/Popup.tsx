import axios from "axios";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export default function Popup(): JSX.Element {
  const [data, setData] = useState<[]>([]);
  const [yMax, setYMax] = useState<number>(50);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab?.url;
      if (typeof url === "string") {
        const urlObj = new URL(url);
        const host = urlObj.host;
        if (host !== "github.com") {
          return;
        }
        const useFull = urlObj.pathname.split("/").slice(1, 3);
        const owner = useFull[0];
        const repo = useFull[1];

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.ossinsight.io/v1/repos/${owner}/${repo}/stargazers/history/`,
          headers: {
            Accept: "application/json",
          },
        };

        axios(config)
          .then((response) => {
            const rows = response?.data?.data?.rows;
            if (typeof rows !== "undefined") {
              setData(rows);
              setYMax(parseInt(rows[rows.length - 1]?.stargazers));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }, []);

  return (
    <div className="h-full pt-10 flex justify-center">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, yMax]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="stargazers" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
