import { Interface } from 'readline';
import { processFile } from '../../process-file';
import { PressureSystem, Valve } from './PreasureSystem';

type Tunnels = {
  [key: string]: {
    flowRate: number;
    valves: string[];
  };
};

const processInput = async (stream: Interface) => {
  const tunnels: Tunnels = {};
  const permutations = [];
  for await (const line of stream) {
    let [_, valve, flowRate, valves] = line.split(/Valve |=|; /);
    valve = valve.replace('has flow rate', '').trim();
    flowRate = flowRate.trim();
    valves = valves.includes('tunnels lead to valves')
      ? valves.replace('tunnels lead to valves ', '')
      : valves.replace('tunnel leads to valve ', '');
    const next = valves?.includes(',') ? valves.split(', ') : [valves];
    tunnels[valve] = {
      flowRate: parseInt(flowRate),
      valves: next,
    };
    if (permutations.length > 0) {
      for (const current of next) {
        const length = permutations.length;
        for (let index = 0; index < length; index++) {
          const permutation = permutations[index];
          const lastChar = permutation[permutation.length - 1];
          if (valve === lastChar) {
            permutations.push([...permutation, current]);
          }
        }
      }
    } else {
      for (const current of next) {
        permutations.push([valve, current]);
      }
    }
  }
  return [tunnels, permutations];
};

const result = async () => {
  const ITERATIONS = 30;
  const stream = await processFile('16/dummy.txt');
  const [tunnels, permutations] = await processInput(stream);
  const debug = true;
};

result().then((data) => console.log(data));
