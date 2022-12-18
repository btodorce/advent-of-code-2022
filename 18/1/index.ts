import { processFile } from '../../process-file';
import { Grid } from './Grid';

const result = async () => {
  const stream = await processFile('18/data.txt');
  const grid = new Grid();
  for await (const line of stream) {
    const [x, y, z] = line.split(',');
    grid.addCube(x, y, z);
  }
  grid.calculateSurfaceArea();
  let sum = 0;
  for (let current = 0; current < grid.cubes.length; current++) {
    sum += grid.cubes[current].sides;
  }
  return sum;
};

result().then((data) => console.log(data));
