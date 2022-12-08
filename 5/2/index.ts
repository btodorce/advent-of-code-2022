import { Interface } from "readline";
import { processFile } from "../../process-file";

type Crate = {
  [id: number]: {
    id: number;
    data: string[];
  };
};

const generate = async (
  stream: Interface,
): Promise<{ crates: Crate; instructions: string[] }> => {
  const crates: Crate = [];
  const instructions = [];
  let counter = 1;
  for await (const line of stream) {
    if (line.includes("move")) {
      instructions.push(line);
      continue;
    }
    if (parseInt(line)) continue;
    if (counter === 10) counter = 1;
    if (!crates[counter]) {
      crates[counter] = {
        id: counter,
        data: [],
      };
    }
    const valid = line
      .split("")
      .filter((_, i) => (i + 1) % 4 !== 0)
      .join("");
    let startIndex = 0;
    let id = 1;
    while (startIndex < valid.length) {
      if (!crates[id]) {
        crates[id] = {
          id: id,
          data: [],
        };
      }
      const entry = valid.substring(startIndex, startIndex + 3);
      if (entry != "   ") crates[id].data.push(entry);
      startIndex += 3;
      id++;
    }
  }
  for (counter = 1; counter < 10; counter++) {
    const items = crates[counter].data.reverse();
    crates[counter].data = items;
  }
  return { crates, instructions };
};

const result = async () => {
  const stream = await processFile("5/data.txt");
  const { crates, instructions } = await generate(stream);
  let onTop = "";
  for (const instruction of instructions) {
    const [take, from, to] = instruction
      .split(/move|from|to /)
      .filter((item) => item !== "");
    const data = [];
    for (let howMany = 0; howMany < Number(take); howMany++) {
      const idFrom = Number(from);
      const item = crates[idFrom].data.pop() as string;
      data.push(item);
    }
    data.reverse().forEach((item) => {
      const idTo = Number(to);
      crates[idTo].data.push(item);
    });
    const debug = "test";
  }
  for (let counter = 1; counter <= 9; counter++) {
    const data = crates[counter].data.pop() as string;
    onTop += data.charAt(1);
  }
  return onTop;
};

result().then((data) => console.log(data));
