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
  const largest = {
    id: 0,
    count: 0,
  };
  for await (const line of reader) {
    if (line === "") {
      if (helpers[current].count > largest.count) {
        largest.id = current;
        largest.count = helpers[current].count;
      }
      current++;
      helpers[current] = {
        count: 0,
      };
    } else {
      helpers[current].count += Number(line);
    }
  }
  console.log(largest);
  return largest;
};

processFileLineByLine("1/data.txt").then();
