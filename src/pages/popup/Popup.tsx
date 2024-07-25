import { ModeToggle } from '@src/components/mode-toggle';
import { ThemeProvider } from '@src/components/theme-provider';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs';

import { LineChart } from '@tremor/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Popup(): JSX.Element {
  const [data, setData] = useState<[]>([]);
  const [yMax, setYMax] = useState<number>(50);
  const [fullRepo, setFullRepo] = useState<string>('');
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab?.url;
      if (typeof url === 'string') {
        const urlObj = new URL(url);
        const host = urlObj.host;
        if (host !== 'github.com') {
          return;
        }
        const useFull = urlObj.pathname.split('/').slice(1, 3);
        const owner = useFull[0];
        const repo = useFull[1];
        setFullRepo(`${owner}/${repo}`);

        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `https://api.ossinsight.io/v1/repos/${owner}/${repo}/stargazers/history/`,
          headers: {
            Accept: 'application/json',
          },
        };

        axios(config)
          .then((response) => {
            const rows = response?.data?.data?.rows;
            if (typeof rows !== 'undefined') {
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Card>
        <CardHeader>
          <CardTitle>{fullRepo}</CardTitle>
          <div className="flex justify-end">
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stargazers">
            <TabsList>
              <TabsTrigger value="stargazers">Stargazers</TabsTrigger>
              {/* <TabsTrigger value="password">Password</TabsTrigger> */}
            </TabsList>
            <TabsContent value="stargazers" className="w-full px-6">
              <div className="flex justify-center">
                <LineChart
                  className="mt-4 h-72"
                  data={data}
                  index="date"
                  categories={['stargazers']}
                  colors={['blue']}
                  yAxisWidth={50}
                  maxValue={yMax}
                  // customTooltip={customTooltip}
                />
              </div>
            </TabsContent>
            {/* <TabsContent value="password">Change your password here.</TabsContent> */}
          </Tabs>
        </CardContent>
        <CardFooter>
          <p>
            Developed by{' '}
            <a
              href="https://github.com/rogerogers/ossinsight-chrome-extension"
              target="_blank"
              rel="noreferrer"
              className="text-blue-900 dark:text-blue-300"
            >
              rogerogers
            </a>
            , and the data is provided by{' '}
            <a
              href="https://ossinsight.io/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-900 dark:text-blue-300"
            >
              OSSInsight
            </a>
          </p>
        </CardFooter>
      </Card>
    </ThemeProvider>
  );
}
