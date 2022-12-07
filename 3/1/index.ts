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
  let counter = 1;
  let rucksack = 0;
  let shared = new Set();
  for await (const line of stream) {
    const entry = Array.from(line);
    const odd = counter % 2 !== 0;
    if (!rucksacks[rucksack])
      rucksacks[rucksack] = {
        first: [],
        second: [],
      };
    if (odd) {
      rucksacks[rucksack].first = entry;
    } else {
      rucksacks[rucksack].second = entry;
      const curr = duplicates(
        rucksacks[rucksack].first ?? [],
        rucksacks[rucksack].second ?? [],
      );
      curr.forEach((data) => shared.add(data));
      rucksack++;
    }
    counter++;
  }
  const result = [...shared]
    .map((curr) => prio(curr as string))
    .reduce((curr, total) => (total += curr));
  console.log(result);
};

result().then();
