// @ts-nocheck
import { processFile } from '../../process-file';
import { Hill, Path } from './Hill';

const result = async () => {
  const stream = await processFile('12/data.txt');
  const hill = new Hill();
  const visited = [];
  const map = [];
  let row = 0;

  for await (const line of stream) {
    const len = line.length;
    map[row] = new Array(len);
    map[row] = line.split('').map((data) => data);
    visited[row] = new Array(len).fill(false);
    row++;
  }
  const queue: Path[] = [];
  hill.map = map;
  // initiate siblings
  const root = { row: 0, column: 0 };
  hill.root = hill.addPath(root);
  const right = hill.addPath({ row: 0, column: 1 }, hill.root);
  const down = hill.addPath({ row: 1, column: 0 }, hill.root);
  if (right) queue.push(right);
  if (down) queue.push(down);

  while (queue.length > 0) {
    const node = queue.shift();
    const { row, column } = node.data;
    const left = hill.addPath({ row, column: column - 1 }, node);
    const right = hill.addPath({ row, column: column + 1 }, node);
    const down = hill.addPath({ row: row + 1, column }, node);
    const up = hill.addPath({ row: row - 1, column }, node);
    if (left) queue.push(left);
    if (right) queue.push(right);
    if (down) queue.push(down);
    if (up) queue.push(up);
    const debug = '';
  }
  const leastDistance = hill.leastDistance?.visited?.length;
  return leastDistance ?? 0;
  return 0;
};

result().then((data) => console.log(data));
