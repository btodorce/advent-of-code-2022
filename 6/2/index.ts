import { processFile } from "../../process-file";

const result = async () => {
  const stream = await processFile("6/data.txt");
  let data = "";
  for await (const line of stream) {
    data += line;
  }
  let longest = 0;
  const len = data.length;
  const size = data.length;
  for (let index = 0; index < data.length; index++) {
    if (len - index > 0) {
      const array = [...data].slice(index, index + 14);
      const unique = [...new Set(array)];
      if (unique.length === 14) {
        longest = index + 14;
        break;
      }
      const debug = "test";
    }
  }
  return longest;
};

result().then((data) => console.log(data));
