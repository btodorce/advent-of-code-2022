import { processFile } from "../../process-file";

type Rucksack = {
  [id: number]: {
    first?: string[];
    second?: string[];
  };
};

const prio = (data: string) => {
  const lowercase = data === data.toLowerCase();
  const result = lowercase ? data.charCodeAt(0) - 96 : data.charCodeAt(0) - 38;
  if (lowercase) {
    return result;
  }
  return result;
};

const duplicates = (first: string[], second: string[]) => {
  let duplicates = [];
  for (const a of first) {
    for (const b of second) {
      if (a === b) duplicates.push(a);
    }
  }
  const value = [...new Set(duplicates)];
  return value;
};

const result = async () => {
  const stream = await processFile("3/data.txt");
  const rucksacks: Rucksack = [
    {
      first: [],
      second: [],
    },
  ];
  let counter = 0;
  let sum = 0;
  for await (const line of stream) {
    const entry = Array.from(line);
    const half = Math.ceil(entry.length / 2);
    const first = entry.slice(0, half);
    const second = entry.slice(half);
    rucksacks[counter] = {
      first,
      second,
    };
    const duplicated = duplicates(first, second);
    sum += duplicated.reduce(
      (accumulator, currentValue) => accumulator + prio(currentValue),
      0,
    );
  }
  console.log(sum);
};

result().then();
