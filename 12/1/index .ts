import { processFile } from '../../process-file';
import { Hill, Path } from './Hill';

const result = async () => {
  const stream = await processFile('12/dummy.txt');
  const hill = new Hill();
  let row = 0;

  for await (const line of stream) {
    const len = line.length;
    hill.map[row] = new Array(len);
    hill.map[row] = line.split('').map((data) => data);
    row++;
  }
  const queue: Path[] = [];
  // initiate siblings
  const root = { row: 0, column: 0 };
  hill.root = hill.addPath(root);
  const right = hill.addPath({ row: 0, column: 1 }, hill.root);
  const down = hill.addPath({ row: 1, column: 0 }, hill.root);
  if (right) queue.push(right);
  if (down) queue.push(down);

  while (queue.length > 0) {
    const node = queue.pop();
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
  const valid = hill.stack.filter((node) => node?.value === 'E');
  const sorted = valid?.sort?.((first, second) => first.steps - second.steps);
  return sorted;
};

result().then();
