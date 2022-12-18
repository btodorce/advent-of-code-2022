import { Interface } from 'readline';
import { processFile } from '../../process-file';
import { createWriteStream } from 'fs';

const processInput = async (stream: Interface) => {
  const data: any[][][] = [];

  for await (const line of stream) {
    const debug = true;
  }
  return data;
};

const result = async () => {
  const stream = await processFile('14/dummy.txt');
  const data = await processInput(stream);
  return 0;
};

result().then((data) => console.log(data));
