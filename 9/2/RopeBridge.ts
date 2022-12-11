import { cp } from "fs";

type Position = {
  row: number;
  column: number;
};

type Tail = {
  id: number;
} & Position;

export class RopeBridge {
  head: Position;
  tails: Tail[];
  board: any[][];

  constructor(size: number) {
    const len = size / 2 - 1;
    this.head = {
      row: len,
      column: len,
    };
    this.tails = [];
    for (let i = 1; i < 10; i++) {
      this.tails[i] = {
        id: i,
        row: len,
        column: len,
      };
    }
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill("."));
    this.updatePosition(this.head.row, this.head.column, "S");
  }

  private follow(id: number) {
    const tail = this.tails[id];
    const compare = id === 1 ? this.head : this.tails[id - 1];
    const colDiff = Math.abs(compare.column - tail.column);
    const rowDiff = Math.abs(compare.row - tail.row);
    if (compare.row === tail.row && compare.column === tail.column) return;
    if (rowDiff < 2 && colDiff < 2) return;
    // On the same check if they are overlapping or 1 col apart
    if (compare.row === tail.row) {
      if (colDiff < 2) return;
      if (tail.column > compare.column) compare.column++;
      else if (tail.column < compare.column) compare.column--;
      const debug = "test";
    } else {
      if (rowDiff < 2) return;
      if (tail.column > compare.column) compare.column++;
      else if (tail.column < compare.column) compare.column--;
      if (tail.row > compare.row) compare.row++;
      else if (tail.row < compare.row) compare.row--;
      const debug = "test";
    }
    this.updatePosition(tail.row, tail.column, id);
  }

  moveRight(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.tails.forEach((tail) => this.follow(tail.id));
      this.head.column++;
      steps--;
    }
  }
  moveLeft(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.tails.forEach((tail) => this.follow(tail.id));
      this.head.column--;
      steps--;
    }
  }
  moveUp(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.tails.forEach((tail) => this.follow(tail.id));
      this.head.row--;
      steps--;
    }
  }
  moveDown(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.tails.forEach((tail) => this.follow(tail.id));
      this.head.row++;
      steps--;
    }
  }

  updatePosition(row: number, column: number, sign: "H" | "S" | number) {
    if (this.board[row][column] === "S") return;
    if (this.board[row][column] === 9) return;
    this.board[row][column] = sign;
  }
  visited() {
    let count = 0;
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (this.board[row][column] === 9 || this.board[row][column] === "S")
          count++;
      }
    }
    return count;
  }
}
