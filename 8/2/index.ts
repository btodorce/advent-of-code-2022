import { processFile } from "../../process-file";

const shouldBreak = (row: number, column: number, array: any[]): boolean => {
  if (row < 0) return true;
  if (column < 0) return true;
  if (row > array.length) return true;
  if (!array[row]) return true;
  if (column > array[row].length) return true;
  return false;
};

const calculateViewDistance = (
  data: number,
  array: any[],
  r: number,
  c: number,
) => {
  let row = r;
  let column = c - 1;
  const siblings = {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  };
  if (r === 3 && c === 2) {
    const debug = "de";
  }
  checkLeft: while (array[row][column]) {
    const current = Number(array[row][column]);
    siblings.left++;
    if (current >= data) break;
    column--;
    if (shouldBreak(row, column, array)) break;
  }
  row = r;
  column = c + 1;
  checkRight: while (array[row][column]) {
    const current = Number(array[row][column]);
    siblings.right++;
    if (current >= data) break;
    column++;
    if (shouldBreak(row, column, array)) break;
  }
  row = r + 1;
  column = c;
  checkBottom: while (array[row][column]) {
    const current = Number(array[row][column]);
    siblings.bottom++;
    if (current >= data) break;
    row++;
    if (shouldBreak(row, column, array)) break;
  }
  row = r - 1;
  column = c;
  checkTop: while (array[row][column]) {
    const current = Number(array[row][column]);
    siblings.top++;
    if (current >= data) break;
    row--;
    if (shouldBreak(row, column, array)) break;
  }
  const sum = siblings.left * siblings.bottom * siblings.right * siblings.top;
  return sum;
};

const edge = (data: string[], row: number, column: number): boolean => {
  if (row === 0) {
    return true;
  }
  if (row === data.length - 1) {
    return true;
  }
  if (column === 0) {
    return true;
  }
  if (column === data[row].length - 1) {
    return true;
  }
  return false;
};

const result = async () => {
  const stream = await processFile("8/data.txt");
  const data = [];
  let result = 0;
  const view: { tree: number; score: number }[] = [];

  for await (const line of stream) {
    const elements = line.split("");
    const row = elements.map((element) => element);
    data.push(row);
  }
  for (let row = 0; row <= data.length - 1; row++) {
    const numColumns = data[row].length - 1;
    for (let column = 0; column <= numColumns; column++) {
      const current = Number(data[row][column]);
      if (edge(data, row, column)) {
        result++;
        continue;
      }
      const score = calculateViewDistance(current, data, row, column);
      view.push({
        tree: current,
        score,
      });
    }
  }
  const score = view.sort((a, b) => b.score - a.score);
  const last = score[0];
  return last;
};

result().then((data) => console.log(data));
