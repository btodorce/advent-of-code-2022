import { processFile } from '../../process-file';
import { Hill, Path } from './Hill';

const result = async () => {
  const stream = await processFile('12/dummy.txt');
  const hill = new Hill();
  const map = [];
  let row = 0;

  const canClimb = (current: Path, next: { row: number; column: number }) => {
    const { value } = current;
    const { row, column } = next;
    if (row < 0 || column < 0) return false;
    if (row > map.length) return false;
    if (column > map[row].length) return false;
    const data = map[row][column];
    if (data === 'E') return true;
    if (data === 'S') return false;
    if (typeof data === 'number') {
      const compare = value === 'S' ? 0 : Number(value);
      if (data - compare > 1) return false;
      return true;
    }
    throw new Error('This should not happen');
  };

  for await (const line of stream) {
    const len = line.length;
    map[row] = new Array(len);
    map[row] = line.split('').map((data) => {
      const lowercase = data === data.toLowerCase();
      if (!lowercase) {
        if (data === 'S') return 'S';
        else if (data === 'E') return 'E';
      }
      const result = data.charCodeAt(0) - 96;
      return result;
    });
    row++;
  }
  const queue: Path[] = [];
  // initiate siblings
  const root = { row: 0, column: 0 };
  hill.root = hill.addPath(root, map[0][0]);
  const sRight = hill.addPath({ row: 0, column: 1 }, map[0][1], hill.root);
  const sDown = hill.addPath({ row: 1, column: 0 }, map[1][0], hill.root);
  queue.push(sRight, sDown);

  while (queue.length > 0) {
    const node = queue.pop();
    const rows = map.length;
    const columns = map[node.data.row].length;
    const { row, column } = node.data;
    if (node.data.column < columns) {
      const right = hill.addPath(
        { row, column: column + 1 },
        map[row][column + 1],
        node
      );
      if (right) queue.push(right);
    }
    if (node.data.column > 0) {
      const left = hill.addPath(
        { row, column: column - 1 },
        map[row][column - 1],
        node
      );
      if (left) queue.push(left);
    }
  }

  return 0;
};

result().then();
