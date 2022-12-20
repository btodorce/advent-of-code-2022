import { Interface } from 'readline';
import { processFile } from '../../process-file';

type Pair = {
  [id: number]: {
    first: any;
    second: any;
  };
};

// two arrays to same depth

const compare = (first: any[], second: any[]) => {
  for (const [index, left] of first.entries()) {
    if (Array.isArray(first[index]) && Array.isArray(second[index])) {
      compare(left[index], second[index]);
    }
    if (!second[index]) return false;
    const right = second[index];
    if (left < right) return true;
    if (left === right) continue;
    if (left > right) return false;
  }
  return true;
};

const processInput = async (stream: Interface): Promise<Pair> => {
  const pairs: Pair = {};
  let counter = 0;

  for await (const line of stream) {
    if (line.match(/^[ \t]*$/gm)) {
      counter++;
      continue;
    }
    if (!pairs[counter])
      pairs[counter] = {
        first: null,
        second: null,
      };
    const data = eval(line);
    if (pairs[counter].first === null) pairs[counter].first = data;
    else pairs[counter].second = data;
  }
  return pairs;
};

const depth = (arr) =>
  arr.reduce((count, v) => (!Array.isArray(v) ? count : 1 + depth(v)), 1);

const result = async () => {
  const stream = await processFile('13/dummy.txt');
  const pairs = await processInput(stream);
  const order = [];
  for (const pair of Object.values(pairs)) {
    const result = compare(pair.first, pair.second);
    const debug = true;
  }
  return 0;
};

result().then();
