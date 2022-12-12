import { processFile } from '../../process-file';
import { Hill, Path } from './Hill';

const result = async () => {
  const stream = await processFile('12/dummy.txt');
  const hill = new Hill();
  const map = [];
  let row = 0;

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
    const rows = map.length - 1;
    const columns = map[node.data.row].length - 1;
    const { row, column } = node.data;
    const innerQueue: Path[] = [];
    const l = map[row][column - 1];
    const r = map[row][column + 1];
    const u = map[row + 1][column];
    const d = map[row - 1][column - 1];
    const left = hill.addPath({ row, column: column - 1 }, l, node);
    const right = hill.addPath({ row, column: column + 1 }, r, node);
    const up = hill.addPath({ row: row + 1, column }, u, node);
    const down = hill.addPath({ row: row - 1, column }, d, node);

    // checkRight: if (node.data.column < columns && node.data.row === row) {
    //   const next = hill.addPath(
    //     { row, column: column + 1 },
    //     map[row][column + 1],
    //     node
    //   );
    //   if (next) {
    //     if (next.value === 'E') {
    //       hill.paths.push(next);
    //       continue;
    //     }
    //     innerQueue.push(next);
    //   }
    // }
    // checkLeft: if (node.data.column > 0 && node.data.row === row) {
    //   const next = hill.addPath(
    //     { row, column: column - 1 },
    //     map[row][column - 1],
    //     node
    //   );
    //   if (next) {
    //     if (next.value === 'E') {
    //       hill.paths.push(next);
    //       continue;
    //     }
    //     innerQueue.push(next);
    //   }
    // }
    // checkTop: if (node.data.row < rows && node.data.column === column) {
    //   const next = hill.addPath(
    //     { row: row + 1, column },
    //     map[row + 1][column],
    //     node
    //   );
    //   if (next) {
    //     if (next.value === 'E') {
    //       hill.paths.push(next);
    //       continue;
    //     }
    //     innerQueue.push(next);
    //   }
    // }

    // checkBottom: if (node.data.row > 0 && node.data.column === column) {
    //   const next = hill.addPath(
    //     { row: row - 1, column },
    //     map[row - 1][column],
    //     node
    //   );
    //   if (next) {
    //     if (next.value === 'E') {
    //       hill.paths.push(next);
    //       continue;
    //     }
    //     innerQueue.push(next);
    //   }
    // }
    queue.push(...innerQueue);
    const debug = '';
  }
  const valid = hill.stack.filter((node) => node?.value === 'E');
  const sorted = valid?.sort?.((first, second) => first.steps - second.steps);
  return sorted;
};

result().then();
