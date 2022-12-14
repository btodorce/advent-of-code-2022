import { cp } from "fs";

type Position = {
  row: number;
  column: number;
};

enum Direction {
  "U" = "up",
  "D" = "down",
  "L" = "left",
  "R" = "right",
}

export class RopeBridge {
  head: Position;
  tail: Position;
  board: any[][];

  constructor(size: number) {
    const len = size / 2 - 1;
    this.head = {
      row: len,
      column: len,
    };
    this.tail = {
      row: len,
      column: len,
    };
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill("."));
    this.updatePosition(this.head.row, this.head.column, "S");
  }

  private follow(direction: Direction) {
    const colDiff = Math.abs(this.head.column - this.tail.column);
    const rowDiff = Math.abs(this.head.row - this.tail.row);
    if (
      this.tail.row === this.head.row &&
      this.tail.column === this.head.column
    )
      return;
    if (rowDiff < 2 && colDiff < 2) return;
    // On the same check if they are overlapping or 1 col apart
    if (this.tail.row === this.head.row) {
      if (colDiff < 1) return;
      if (this.head.column > this.tail.column) this.tail.column++;
      else if (this.head.column < this.tail.column) this.tail.column--;
      const debug = "test";
    } else {
      if (rowDiff < 1) return;
      if (this.head.column > this.tail.column) this.tail.column++;
      else if (this.head.column < this.tail.column) this.tail.column--;
      if (this.head.row > this.tail.row) this.tail.row++;
      else if (this.head.row < this.tail.row) this.tail.row--;
      const debug = "test";
    }
    this.updatePosition(this.tail.row, this.tail.column, "T");
  }

  moveRight(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.follow(Direction.R);
      this.head.column++;
      steps--;
    }
  }
  moveLeft(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.follow(Direction.L);
      this.head.column--;
      steps--;
    }
  }
  moveUp(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.follow(Direction.U);
      this.head.row--;
      steps--;
    }
  }
  moveDown(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.follow(Direction.D);
      this.head.row++;
      steps--;
    }
  }

  updatePosition(row: number, column: number, sign: "H" | "S" | "T") {
    if (this.board[row][column] === "S") return;
    if (this.board[row][column] === "T" && sign == "H") return;
    this.board[row][column] = sign;
  }
  visited() {
    let count = 0;
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (this.board[row][column] === "T" || this.board[row][column] === "S")
          count++;
      }
    }
    return count;
  }
}
