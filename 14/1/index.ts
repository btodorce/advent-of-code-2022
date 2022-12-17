// @ts-nocheck
import { Interface } from 'readline';
import { processFile } from '../../process-file';

type Position = {
  x: number;
  y: number;
};

type Point = {
  [id: number]: {
    from: Position;
    to: Position;
  };
};

const processInput = async (stream: Interface): [] => {
  const instructions = [];
  const rows: Position = {
    x: null,
    y: null,
  };
  let columns: Position = {
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
      if (rows.x === null) rows.x = x;
      if (rows.y === null) rows.y = x;
      if (x < rows.x) rows.x = x;
      if (x > rows.y) rows.y = x;

      // Setting number of columns
      if (columns.y === null) columns.y = y;
      if (y > columns.y) columns.y = y;

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
  return [instructions, rows, columns];
};

const generateRockFormation = (
  instructions: [],
  rows: Position,
  columns: Position
) => {
  const map = Array(columns.y + 1)
    .fill(null)
    .map(() => Array(rows.y - rows.x + 1).fill('.'));
  for (const [_, instruction] of Object.entries(instructions)) {
    for (const [__, set] of Object.entries(instruction)) {
      let startRow = getRow(set.from.x, rows);
      const endRow = getRow(set.to.x, rows);
      let startColumn = set.from.y;
      const endColumn = set.to.y;
      const rowSteps = Math.abs(startRow - endRow);
      const columnSteps = Math.abs(startColumn - endColumn);
      let steps = rowSteps + columnSteps + 1;
      const sign = '#';
      while (steps > 0) {
        if (startRow > +endRow) {
          map[startColumn][startRow] = sign;
          startRow--;
        } else if (startRow < endRow) {
          map[startColumn][startRow] = sign;
          startRow++;
        } else if (startColumn >= endColumn) {
          map[startColumn][startRow] = sign;
          startColumn--;
        } else if (startColumn < endColumn) {
          map[startColumn][startRow] = sign;
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

const getRow = (row: number, rows: Position) => {
  if (row === rows.x) return 0;
  if (row > rows.x) return row - rows.x;
  if (row < rows.y) return rows.y - row;
  throw new Error('This should not happen');
};

const getColumn = (column: number, columns: Position) => {
  if (column === rows.x) return 0;
  if (column > rows.x) return column - columns.x;
  if (column < rows.y) return columns.y - column;
  throw new Error('This should not happen');
};

const fillSand = (
  map: [],
  sand: { row: number; column: number },
  initial: { row: number; column: number },
  max: { row: number; column: number }
) => {
  const { row, column } = sand;
  const down = map[row + 1][column];
  const diagonalLeft = map[row + 1][column - 1];
  const diagonalRight = map[row + 1][column + 1];
  if (
    ignored.includes(down) &&
    ignored.includes(diagonalLeft) &&
    ignored.includes(diagonalRight)
  ) {
    map[row][column] = 'o';
    fillSand(map, initial, initial, max);
  }
  if (!ignored.includes(down)) {
    if (row < max.row) {
      fillSand(map, { row: row + 1, column }, initial, max);
    }
  } else if (!ignored.includes(diagonalLeft)) {
    if (row < max.row && column > 0) {
      fillSand(map, { row: row + 1, column: column - 1 }, initial, max);
    }
  } else if (!ignored.includes(diagonalRight)) {
    if (row < max.row && column < max.column) {
      fillSand(map, { row: row + 1, column: column + 1 }, initial, max);
    }
  }
  return map;
  const debug = true;
};
const result = async () => {
  const stream = await processFile('14/data.txt');
  const [instructions, rows, columns] = await processInput(stream);
  const map = generateRockFormation(instructions, rows, columns);
  const sand = {
    column: getRow(500, rows),
    row: 0,
  };
  const lastRow = getRow(rows.y, rows);
  map[sand.row][sand.column] = '+';
  sand.row++;
  const filledMap = fillSand(map, sand, sand, {
    row: lastRow,
    column: columns.y,
  });
  const sum = filledMap.reduce(
    (acc, row) => acc + row.filter((item) => item === sign).length,
    0
  );

  return sum;
};

result().then((data) => console.log(data));
