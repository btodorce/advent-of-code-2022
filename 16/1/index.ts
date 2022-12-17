import { Interface } from 'readline';
import { processFile } from '../../process-file';
import { PressureSystem } from './PreasureSystem';

type Tunnel = {
  [key: string]: {
    flow: number;
    valves?: string[];
  };
};

type Instruction = {
  valve: string;
  flow: number;
  adjacencies: string[];
};
const ITERATIONS = 30;

const processInput = async (stream: Interface) => {
  const tunnels: Tunnel = {};
  const instructions: Instruction[] = [];
  for await (const line of stream) {
    let [_, valve, flowRate, valves] = line.split(/Valve |=|; /);
    valve = valve.replace('has flow rate', '').trim();
    flowRate = flowRate.trim();
    const flow = parseInt(flowRate);
    valves = valves.includes('tunnels lead to valves')
      ? valves.replace('tunnels lead to valves ', '')
      : valves.replace('tunnel leads to valve ', '');
    const adjacencies = valves?.includes(',') ? valves.split(', ') : [valves];
    tunnels[valve] = {
      flow,
      valves: adjacencies,
    };
    instructions.push({
      valve,
      flow,
      adjacencies,
    });
  }
  return { tunnels, instructions };
};

const generatePressureSystem = (
  tunnels: Tunnel,
  instructions: Instruction[]
) => {
  const ps = new PressureSystem();
  for (const { valve, flow, adjacencies } of instructions) {
    if (ps.root === null) {
      ps.setRoot(valve, flow);
    } else {
    }
    for (const adjacent of adjacencies) {
      const { flow: adjacentFlow } = tunnels[adjacent];
      const newValve = ps.addValve(
        { name: adjacent, flow: adjacentFlow },
        valve
      );
    }
  }
  return ps;
};

const getPermutations = (tunnels: Tunnel, instructions: Instruction[]) => {
  const permutations = [];
  const valves = Object.keys(tunnels).map((k) => {
    return {
      name: k,
      opened: false,
    };
  });
  // if (permutations.length > 0) {
  //   for (const current of next) {
  //     const length = permutations.length;
  //     for (let index = 0; index < length; index++) {
  //       const permutation = permutations[index];
  //       const lastChar = permutation[permutation.length - 1];
  //       if (valve === lastChar) {
  //         permutations.push([...permutation, current]);
  //       }
  //     }
  //   }
  // } else {
  //   for (const current of next) {
  //     permutations.push([valve, current]);
  //   }
  // }

  const debug = true;
};

const result = async () => {
  const stream = await processFile('16/dummy.txt');
  const { tunnels, instructions } = await processInput(stream);
  const ps = generatePressureSystem(tunnels, instructions);
  const permutations = getPermutations(tunnels, instructions);
  let max = 0;
  let counter = 0;

  const debug = true;
};

result().then((data) => console.log(data));
