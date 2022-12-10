import { dir } from "console";

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
      row: size - 1,
      column: 0,
    };
    this.tail = {
      row: size - 1,
      column: 0,
    };
    this.board = Array(5)
      .fill(null)
      .map(() => Array(6).fill("."));
  }

  private follow(direction: Direction) {
    // const difference = Math.abs(
    //   this.head.column - this.tail.column - (this.head.row - this.tail.row),
    // );
    // if (
    //   this.tail.row === this.head.row &&
    //   this.tail.column === this.head.column
    // )
    //   return;
    // if (difference <= 1 && this.head.row === this.tail.row) return;
    // if (
    //   difference < 1 &&
    //   this.head.row !== this.tail.row &&
    //   direction !== Direction.D
    // )
    //   return;
    // if (direction === Direction.R) {
    //   if (this.tail.row !== this.head.row) {
    //     this.tail.row = this.head.row;
    //   }
    //   this.tail.column++;
    // }
    // if (direction === Direction.L) {
    //   if (this.tail.row !== this.head.row) {
    //     this.tail.row = this.head.row;
    //   }
    //   this.tail.column--;
    // }
    // if (direction === Direction.U) {
    //   if (this.tail.column !== this.head.column) {
    //     this.tail.column = this.head.column;
    //   }
    //   this.tail.row++;
    // }
    // if (direction === Direction.D) {
    //   if (this.tail.column !== this.head.column) {
    //     this.tail.column = this.head.column;
    //   }
    //   this.tail.row--;
    // }
    // this.updatePosition(this.tail.row, this.tail.column, "T");
  }

  moveRight(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.head.column++;
      steps--;
      this.follow(Direction.R);
    }
  }
  moveLeft(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.head.column--;
      steps--;
      this.follow(Direction.L);
    }
  }
  moveUp(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.head.row--;
      steps--;
      this.follow(Direction.U);
    }
  }
  moveDown(steps: number) {
    while (steps > 0) {
      this.updatePosition(this.head.row, this.head.column, "H");
      this.head.row++;
      steps--;
      this.follow(Direction.D);
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
    return count + 1;
  }
}
