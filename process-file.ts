import { createReadStream } from "fs";
import { createInterface, Interface } from "readline";

export const processFile = async (path: string): Promise<Interface> => {
  const stream = createReadStream(path);
  const reader = createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  return reader;
};
