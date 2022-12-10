import { processFile } from "../../process-file";

const shouldBreak = (row: number, column: number, array: any[]): boolean => {
  if (row < 0) return true;
  if (column < 0) return true;
  if (row > array.length) return true;
  if (!array[row]) return true;
  if (column > array[row].length) return true;
  return false;
};

const visible = (data: number, array: any[], r: number, c: number) => {
  let row = r;
  let column = c - 1;
  if (r === 3 && c === 3) {
    const debug = "true";
  }
  const siblings = {
    left: [],
    right: [],
    bottom: [],
    top: [],
  };
  // console.log("----------------------", `\n data: ${data}`);
  checkLeft: while (array[row][column]) {
    const current = Number(array[row][column]);
    if (current >= data) siblings.left.push(current);
    column--;
    if (shouldBreak(row, column, array)) break;
  }
  row = r;
  column = c + 1;
  checkRight: while (array[row][column]) {
    const current = Number(array[row][column]);
    if (current >= data) siblings.right.push(current);
    column++;
    if (shouldBreak(row, column, array)) break;
  }
  row = r + 1;
  column = c;
  checkBottom: while (array[row][column]) {
    const current = Number(array[row][column]);
    if (current >= data) siblings.bottom.push(current);
    row++;
    if (shouldBreak(row, column, array)) break;
  }
  row = r - 1;
  column = c;
  checkTop: while (array[row][column]) {
    const current = Number(array[row][column]);
    if (current >= data) siblings.top.push(current);
    row--;
    if (shouldBreak(row, column, array)) break;
  }
  if (
    siblings.top.length > 0 &&
    siblings.bottom.length > 0 &&
    siblings.left.length > 0 &&
    siblings.right.length > 0
  )
    return false;
  return true;
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
      const isVisible = visible(current, data, row, column);
      if (isVisible) {
        // console.log(`\n Visible: ${current}, row: ${row} column: ${column}`);
        result++;
      }
    }
  }
  const debug = "true";
  return result;
};

result().then((data) => console.log(data));
