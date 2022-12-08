import { prio } from "../1";
import { processFile } from "../../process-file";

type Rucksack = {
  [id: number]: {
    first: string[];
    second: string[];
    third: string[];
  };
};

type Shared = {
  [id: number]: {
    shared: string[];
  }[];
};

export const duplicates = (
  first: string[],
  second: string[],
  third: string[],
) => {
  let duplicates = [];
  for (const a of first) {
    for (const b of second) {
      if (a === b) {
        for (const c of third) {
          if (a === c) {
            duplicates.push(a);
          }
        }
      }
    }
  }
  const value = [...new Set(duplicates)];
  return value;
};

const result = async () => {
  const stream = await processFile("3/data.txt");
  let counter = 1;
  let id = 0;
  let sum = 0;
  const rucksacks: Rucksack = [];
  for await (const line of stream) {
    // console.log(id, counter);
    const entry = Array.from(line);
    if (!rucksacks[id]) {
      rucksacks[id] = {
        first: [],
        second: [],
        third: [],
      };
    }
    if (rucksacks[id].first.length === 0) rucksacks[id].first = entry;
    else if (rucksacks[id].second.length === 0) rucksacks[id].second = entry;
    else if (rucksacks[id].third.length === 0) rucksacks[id].third = entry;
    if (counter % 3 === 0) {
      const intersect = duplicates(
        rucksacks[id].first,
        rucksacks[id].second,
        rucksacks[id].third,
      );
      sum += prio(intersect[0]);
      id++;
    }
    counter++;
  }
  return sum;
};

result().then();
