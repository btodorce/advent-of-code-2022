import { processFile } from "../../process-file";

const range = (data: string) => {
  const [first, second] = data.split("-");
  const f = Number(first);
  const s = Number(second);
  const result = new Array(s - f).fill(1).map((_, k) => k + f);
  result.push(s);
  return result;
};

const result = async () => {
  const stream = await processFile("4/data.txt");

  let contained = 0;

  for await (const line of stream) {
    const [first, second] = line.split(",");
    const pair = {
      first: range(first),
      second: range(second),
    };
    if (
      pair.first.every((entry) => pair.second.includes(entry)) ||
      pair.second.every((entry) => pair.first.includes(entry))
    ) {
      console.log();
      contained++;
    }
  }
  return contained;
};

result().then();
