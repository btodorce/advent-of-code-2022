import { processFile } from "../../process-file";

const result = async () => {
  const stream = await processFile("6/data.txt");
  let data = "";
  for await (const line of stream) {
    data += line;
  }
  let longest: string[] = [];
  let pos = 0;
  [...data].find((char, index) => {
    if (longest.length === 4) {
      const set = [...new Set(longest)];
      if (set.length === 4) {
        pos = index;
        return char;
      }
      longest = [];
    }
    longest.push(char);
  });
  return pos;
};

result().then((data) => console.log(data));
