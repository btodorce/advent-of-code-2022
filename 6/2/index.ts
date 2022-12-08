import { processFile } from "../../process-file";

const result = async () => {
  const stream = await processFile("6/data.txt");
  let data = "";
  for await (const line of stream) {
    data += line;
  }
  let longest: string[] = [];
  let pos = 0;
  const size = data.length;
  [...data].find((char, index) => {
    if (longest.length === 14) {
      console.log(longest);
      const set = [...new Set(longest)];
      if (set.length === 14) {
        console.log(set.length);
        pos = index;
        return index;
      }
      longest = [];
    }
    longest.push(char);
  });
  return pos;
};

result().then((data) => console.log(data));
