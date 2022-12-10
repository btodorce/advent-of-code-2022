import { Interface } from "readline";
import { processFile } from "../../process-file";

type Cycle = {
  [id: number]: {
    id: number;
    register: number;
  };
};

const processInput = async (stream: Interface) => {
  const cpu: Cycle = [];
  let sum = 1;
  let tact = 1;
  for await (const line of stream) {
    const [command, value] = line.split(" ");
    if (command === "noop") {
      cpu[tact] = {
        id: tact,
        register: sum,
      };
      tact++;
    }
    if (command === "addx") {
      cpu[tact] = {
        id: tact,
        register: sum,
      };
      tact++;
      cpu[tact] = {
        id: tact,
        register: sum,
      };
      tact++;
      sum += Number(value);
    }
  }
  return [...Object.values(cpu)];
};

const result = async () => {
  const stream = await processFile("10/data.txt");
  let counter = 0;

  const values = await processInput(stream);
  const crt = Array(7)
    .fill(null)
    .map(() => Array(40).fill("."));

  for (let cycle of values) {
    const row = Math.floor(cycle.id / 40);
    const id = (cycle.id % 40) - 1;
    const cmp = counter % 40;
    const intersecting =
      cycle.register === cmp ||
      cycle.register + 1 === cmp ||
      cycle.register - 1 === cmp;

    if (intersecting) {
      crt[row][id] = "#";
    } else {
      crt[row][id] = ".";
    }
    const debug = "as";
    counter++;
  }
  return 0;
};

result().then((data) => console.log(data));
