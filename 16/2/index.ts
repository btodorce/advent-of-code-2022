import { Interface } from 'readline';
import { processFile } from '../../process-file';
import { PressureSystem, Valve } from './PreasureSystem';

type Tunnel = {
  [key: string]: {
    flow: number;
    valves: { name: string; flow: number }[];
  };
};

type Instruction = {
  valve: string;
  flow: number;
  adjacencies: string[];
};

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
    const valveNodes = adjacencies.map((node) => {});
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
  let iter = ps.root;
  for (const { valve, flow, adjacencies } of instructions) {
    if (ps.root === null) {
      ps.root = new Valve(valve, flow);
      iter = ps.root;
    } else {
    }
    for (const adjacent of adjacencies) {
      const { flow } = tunnels[adjacent];
      const newValve = new Valve(adjacent, flow, iter);
      iter.addValve(newValve);
    }
  }
  return ps;
};

const result = async () => {
  const stream = await processFile('16/dummy.txt');
  const { tunnels, instructions } = await processInput(stream);
  const ps = generatePressureSystem(tunnels, instructions);
  const debug = true;
};

result().then((data) => console.log(data));
