import { processFile } from "../../process-file";

type Cycle = {
  [id: number]: {
    id: number;
    register: number;
  };
};

const result = async () => {
  const stream = await processFile("10/data.txt");
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
  const values = [...Object.values(cpu)];
  let result = 0;
  const val = [20, 60, 100, 140, 180, 220];
  values.forEach((value) => {
    if (val.includes(value.id)) {
      result += value.id * value.register;
    }
  });
  return result;
};

result().then((data) => console.log(data));
