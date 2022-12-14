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
  const values = await processInput(stream);
  const val = [20, 60, 100, 140, 180, 220];
  const result = values.reduce(
    (total, value) =>
      val.includes(value.id) ? total + value.id * value.register : total + 0,
    0,
  );
  return result;
};

result().then((data) => console.log(data));
