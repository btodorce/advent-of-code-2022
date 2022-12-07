import { createReadStream } from "fs";
import { createInterface } from "readline";

type Elf = {
  [id: number]: {
    count: number;
  };
};

const processFileLineByLine = async (path: string) => {
  const stream = createReadStream(path);
  const reader = createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  const helpers: Elf = [
    {
      count: 0,
    },
  ];
  let current = 0;
  for await (const line of reader) {
    if (line === "") {
      current++;
      helpers[current] = {
        count: 0,
      };
    } else {
      helpers[current].count += Number(line);
    }
  }
  const data = Object.values([helpers]).flat();
  const result: {} = [...data]
    .sort((a: any, b: any) =>
      a.count < b.count ? 1 : a.count > b.count ? -1 : 0,
    )
    .slice(0, 3)
    .reduce((total: any, item: any) => {
      total.count += item.count;
      return total;
    });
  return result;
};

processFileLineByLine("1/data.txt").then();
