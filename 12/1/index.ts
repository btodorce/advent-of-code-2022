import { processFile } from '../../process-file';
import { Hill, Path } from './Hill';

const result = async () => {
  const stream = await processFile('12/data.txt');
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
  const queue = [];
  const hill = new Hill(map);
  const root = { row: 0, column: 0 };
  const right = hill.addPath({ row: 0, column: 1 }, root);
  const down = hill.addPath({ row: 1, column: 0 }, root);
  if (right) queue.push(right);
  if (down) queue.push(down);

  while (queue.length > 0) {
    const node = queue.shift();
    const { row, column } = node;
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
  return 0;
};

result().then((data) => console.log(data));
