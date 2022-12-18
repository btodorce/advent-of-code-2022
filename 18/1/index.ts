import { processFile } from '../../process-file';
import { Grid } from '../Grid';

const result = async () => {
  const stream = await processFile('18/debug.txt');
  const grid = new Grid();
  for await (const line of stream) {
    const [x, y, z] = line.split(',');
    grid.addCube(x, y, z);
    const debug = true;
  }
  const result = grid.surfaceArea();
  return 0;
};

result().then((data) => console.log(data));
