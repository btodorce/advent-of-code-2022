import { processFile } from '../../process-file';
import { Hill, ID } from './Hill';

const result = async () => {
  const stream = await processFile('12/dummy.txt');
  const visited = [];
  const map = [];
  let row = 0;

  const inBounds = ({ row, column }) => {
    if (row < 0 || column < 0) return;
    if (row >= map.length || column >= map[row].length) return;
    return true;
  };

  for await (const line of stream) {
    const len = line.length;
    map[row] = new Array(len);
    map[row] = line.split('').map((data) => data);
    visited[row] = new Array(len).fill(false);
    row++;
  }
  const root = { row: 0, column: 0 };
  const hill = new Hill(map, root);

  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[row].length; column++) {
      const left = { row, column: column - 1 };
      const right = { row, column: column + 1 };
      const down = { row: row + 1, column };
      const up = { row: row - 1, column };
      [left, right, down, up].forEach((path) =>
        hill.addPath({ row, column }, path)
      );
    }
  }
  const result = hill.bfs();
  const res = hill.dfs();

  return result;
};

result().then((data) => console.log(data));
