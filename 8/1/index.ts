import { processFile } from "../../process-file";

/**
 * Copy all the edges into a helper array
 */
const fillArray = (data: any[]) => {
  const helper = [];
  for (let row = 0; row <= data.length - 1; row++) {
    const numColumns = data[row].length - 1;
    const empty = [].fill(0, 0, numColumns);
    helper.push(empty);
    for (let column = 0; column <= numColumns; column++) {
      const current = data[row][column];
      // Copy all the edges into a helper array
      if (row === 0) helper[row][column] = current;
      else if (column === 0) helper[row][column] = current;
      else if (row === data.length - 1) helper[row][column] = current;
      else if (column === numColumns) helper[row][column] = current;
      else {
        helper[row][column] = 0;
      }
    }
  }
  return helper;
};
const visible = (data: number, array: any[], r: number, c: number) => {
  // console.log(`pointer: ${pointer}, len: ${len}`);
  let pointer = c - 1;
  checkLEft: while (array[r][pointer]) {
    const current = Number(array[r][pointer]);
    // console.log(
    //   `comparing left: ${data}, to: ${current}, is visible: ${data > current}`,
    // );
    if (data === current) break;
    else if (data > current) return true;
    pointer--;
  }
  pointer = c + 1;
  checkRight: while (array[r][pointer]) {
    const current = Number(array[r][pointer]);
    // console.log(
    //   `comparing right: ${data}, to: ${current}, is visible: ${data > current}`,
    // );
    if (data === current) break;
    else if (data > current) return true;
    pointer++;
  }
  pointer = r - 1;
  checkTop: while (array[pointer][c]) {
    const current = Number(array[pointer][c]);
    // console.log(
    //   `comparing top: ${data}, to: ${current}, is visible: ${data > current}`,
    // );
    if (data === current) break;
    else if (data > current) return true;
    if (pointer === 0) break;
    pointer--;
  }
  pointer = r + 1;
  checkBottom: while (array[pointer][c]) {
    const current = Number(array[pointer][c]);
    // console.log(
    //   `comparing bottom: ${data}, to: ${current}, is visible: ${
    //     data > current
    //   }`,
    // );
    if (data === current) break;
    else if (data > current) return true;
    pointer--;
  }
  return false;
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
  const utilArray = fillArray(data);
  for (let row = 0; row <= data.length - 1; row++) {
    const numColumns = data[row].length - 1;
    console.log("\n");
    for (let column = 0; column <= numColumns; column++) {
      const current = Number(data[row][column]);
      if (edge(data, row, column)) {
        result++;
        continue;
      }
      const isVisible = visible(current, data, row, column);
      if (isVisible) {
        result++;
      }
      // utilArray[row][column] = current;
      // // if (isVisible) {
      // //   result++;
      // // }
    }
  }
  return result;
  const debug = "true";
};

result().then((data) => console.log(data));
