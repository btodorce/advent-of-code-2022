import { Interface } from 'readline';
import { processFile } from '../../process-file';
import { createWriteStream } from 'fs';

type Data = {
  from: Position;
  to: Position;
};

type Position = {
  x: number;
  y: number;
};

type Point = {
  [id: number]: Data;
};

const processInput = async (stream: Interface) => {
  const instructions = [];
  const columns: Position = {
    x: null,
    y: null,
  };
  let rows: Position = {
    x: 0,
    y: null,
  };
  for await (const line of stream) {
    const points = line.split(' -> ');
    const instruction: Point = {
      [0]: {
        from: null,
        to: null,
      },
    };
    let counter = 0;
    for (const point of points) {
      if (
        instruction[counter].from !== null &&
        instruction[counter].to !== null
      )
        counter++;
      if (!instruction[counter])
        instruction[counter] = {
          from: null,
          to: null,
        };
      const [first, second] = point.split(',');
      // Setting rows and columns
      const x = Number(first);
      const y = Number(second);

      // Setting number of rows
      if (rows.y === null) rows.y = y;
      if (y > rows.y) rows.y = y;

      if (columns.x === null) columns.x = x;
      if (columns.y === null) columns.y = y;
      if (x < columns.x) columns.x = x;
      if (x > columns.y) columns.y = x;

      const position = {
        x,
        y,
      };
      if (counter === 0) {
        if (instruction[counter].from === null)
          instruction[counter].from = position;
        else instruction[counter].to = position;
      }
      if (
        instruction[counter].from === null &&
        instruction[counter].to === null &&
        instruction[counter - 1]?.from !== null &&
        instruction[counter - 1]?.to !== null
      ) {
        instruction[counter].from = instruction[counter - 1].to;
        instruction[counter].to = position;
      }
    }
    instructions.push(instruction);
    const debug = true;
  }
  return { instructions, rows, columns };
};

const generateRockFormation = (
  instructions: any[],
  rows: Position,
  columns: Position
) => {
  const map = Array(rows.y + 1)
    .fill(null)
    .map(() => Array(columns.y - columns.x + 1).fill('.'));
  for (const [_, instruction] of Object.entries(instructions)) {
    for (const [__, set] of Object.entries(instruction)) {
      const data = set as Data;
      let startRow = data.from.y;
      const endRow = data.to.y;
      let startColumn = getColumns(data.from.x, columns);
      const endColumn = getColumns(data.to.x, columns);
      const rowSteps = Math.abs(startRow - endRow);
      const columnSteps = Math.abs(startColumn - endColumn);
      let steps = rowSteps + columnSteps + 1;
      const sign = '#';
      while (steps > 0) {
        if (startRow > endRow) {
          map[startRow][startColumn] = sign;
          startRow--;
        } else if (startRow < endRow) {
          map[startRow][startColumn] = sign;
          startRow++;
        } else if (startColumn >= endColumn) {
          map[startRow][startColumn] = sign;
          startColumn--;
        } else if (startColumn < endColumn) {
          map[startRow][startColumn] = sign;
          startColumn++;
        }
        steps--;
      }
    }
  }
  return map;
};

const sign = 'o';

const ignored = ['o', '#'];

const getColumns = (row: number, rows: Position) => {
  if (row === rows.x) return 0;
  if (row > rows.x) return row - rows.x;
  if (row < rows.y) return rows.y - row;
  throw new Error('This should not happen');
};

const fillSand = (
  map: any[][],
  sand: { row: number; column: number },
  initial: { row: number; column: number },
  max: { row: number; column: number }
) => {
  const { row, column } = sand;
  const down = map[row + 1][column];
  const diagonalLeft = map[row + 1][column - 1];
  const diagonalRight = map[row + 1][column + 1];

  const inBounds =
    row > 0 && row < max.row && column > 0 && column < max.column;

  if (!inBounds) {
    return fillSand(map, initial, initial, max);
  }
  if (
    ignored.includes(down) &&
    ignored.includes(diagonalLeft) &&
    ignored.includes(diagonalRight)
  ) {
    map[row][column] = 'o';
    return fillSand(map, initial, initial, max);
  }
  if (!ignored.includes(down)) {
    return fillSand(map, { row: row + 1, column }, initial, max);
  }
  if (!ignored.includes(diagonalLeft)) {
    return fillSand(map, { row: row + 1, column: column - 1 }, initial, max);
  }
  if (!ignored.includes(diagonalRight)) {
    return fillSand(map, { row: row + 1, column: column + 1 }, initial, max);
  }
  const debug = true;
  return map;
};

const result = async () => {
  const stream = await processFile('14/dummy.txt');
  const { instructions, rows, columns } = await processInput(stream);
  const map = generateRockFormation(instructions, rows, columns);
  // console.table(map);
  const sand = {
    column: getColumns(500, columns),
    row: 0,
  };
  const lastRow = rows.y;
  map[0][sand.column] = '+';
  sand.row++;
  fillSand(map, sand, sand, {
    row: lastRow,
    column: getColumns(columns.y, columns),
  });
  // const logger = createWriteStream('14/1/log.txt', {
  //   flags: 'a', // 'a' means appending (old data will be preserved)
  // });

  // for (const row of map) {
  //   const toWrite = `${row.join(' ')}\n`;
  //   logger.write(toWrite);
  // }

  const sum = map.reduce(
    (acc, row) => acc + row.filter((item) => item === sign).length,
    0
  );
  // console.table(map);
  return sum;
};

result().then((data) => console.log(data));
