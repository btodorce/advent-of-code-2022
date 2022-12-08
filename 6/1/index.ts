import { processFile } from "../../process-file";

const result = async () => {
  const stream = await processFile("6/data.txt");
  let data = "";
  for await (const line of stream) {
    data += line;
  }
  let longest: string[] = [];
  const result = [...data].some((char, index) => {
    if (longest.length === 4) {
      const set = [...new Set(longest)];
      if (set.length === 4) {
        return index;
      }
      longest = [];
    }
    longest.push(char);
  });
  return result;
};

result().then((data) => console.log(data));
