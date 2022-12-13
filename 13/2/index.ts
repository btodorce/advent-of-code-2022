import { Interface } from 'readline';
import { processFile } from '../../process-file';

type Pair = {
  [id: number]: {
    first: any;
    second: any;
  };
};

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
  const debug = [5, 6];

  outer: for (let [id, { first, second }] of Object.entries(pairs)) {
    const pairId = Number(id) + 1;
    // Bring to equal depth
    if (first.length < 1) order.push(pairId);
    const left = first.map((current, index) => {
      const next = second[index];
      if (typeof current === 'number' && typeof current === 'number')
        return current;
      else if (Array.isArray(next) && Array.isArray(current))
        return depth(current) > 2 ? current.flat() : [current];
      else if (Array.isArray(next) && !Array.isArray(current)) return [current];
      return current;
    });
    const right = second.map((current, index) => {
      const previous = first[index];
      if (typeof previous === 'number' && typeof current === 'number')
        return current;
      else if (Array.isArray(previous) && Array.isArray(current))
        return depth(current) > 2 ? current.flat() : [current];
      else if (Array.isArray(previous) && !Array.isArray(current))
        return [current];
      return current;
    });
    const deb = true;
    inner: for (const current in left) {
      const iter = Object.keys(current).indexOf(current);
      //   if (!right[index]) {
      //     continue outer;
      //   }
      //   const next = right[index];
      //   if (Array.isArray(current) && Array.isArray(next)) {
      //     const valid = compare(current, next);
      //   }
      //   if (typeof sLeft === 'number' && typeof sRight === 'number') {
      //     if (sLeft < sRight) {
      //       order.push(pairId);
      //       continue outer;
      //     }
      //   } else if (Array.isArray(sLeft) && Array.isArray(sRight)) {
      //     const valid = compare(sLeft, sRight);
      //     if (valid) {
      //       order.push(pairId);
      //       continue outer;
      //     }
      //     const test = '';
      //   } else {
      //     throw new Error('This should not happen');
      //   }
      const test = 'test';
    }
  }
  //   const sum = order.reduce((total, current) => (total += current));
  return 0;
};

result().then();
