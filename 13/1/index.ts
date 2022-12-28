import { Interface } from 'readline';
import { processFile } from '../../process-file';

type Pair = {
  [id: number]: {
    first: any;
    second: any;
  };
};

type CompareInput = any[];

const compare = (
  a: CompareInput,
  b: CompareInput,
  _?: CompareInput,
  __?: CompareInput
) => {
  const [first, ...restFirst] = a;
  const [second, ...restSecond] = b;
  const debug = true;
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

const result = async () => {
  const stream = await processFile('13/dummy.txt');
  const pairs = await processInput(stream);
  const order = [];
  for (const pair of Object.values(pairs)) {
    const [first, ...rest] = pair.first;
    const [second, ...others] = pair.second;
    const comparing = compare(pair.first, pair.second);
    const debug = true;
  }
  return 0;
};

result().then();
