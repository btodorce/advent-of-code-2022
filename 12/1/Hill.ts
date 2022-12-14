// @ts-nocheck
import { Both, Maybe } from '../../types';

type ID = {
  row: number;
  column: number;
};

export class Path {
  data: ID;
  value: string | number;
  char: string;
  steps: number;
  previous: Maybe<Path>;
  visited: ID[] = [];
  next: Path;
  constructor(
    data: ID,
    value: string | number,
    char: string,
    previous: Path,
    next: Path
  ) {
    this.data = data;
    this.char = char;
    this.value = value;
    this.previous = previous;
    this.next = next;
    if (previous === null) this.visited = [data];
    else {
      if (char === 'E') this.visited = [...previous.visited];
      else
        this.visited =
          previous?.visited?.length > 0 ? [...previous.visited, data] : [data];
    }
  }
}

const chars = ['S', 'U'];

export class Hill {
  // steps = weight of Path, starting weight is 0 for root Path
  root: Path;
  stack: Path[] = [];
  paths = [];
  map: any[] = [];
  leastDistance: Path = null;

  private climbable(node: Path, data: string | number) {
    if (node === null) return true;
    const { char, value } = node;
    if (char === 'E') return false;
    if (data === 'S') return false;
    if (typeof data === 'number') {
      const compare = value === 'S' ? 0 : Number(value);
      if (data - compare <= 1) return true;
    }
    return false;
  }
  private inBounds(row: number, column: number, node: Path) {
    if (row < 0 || row > this.map.length - 1) return false;
    if (column < 0 || column > this.map[row].length - 1) return false;
    return true;
  }

  private visited(data: ID, node: Path) {
    if (node === null) return false;
    return node?.visited?.find?.(
      (current) => current?.column === data.column && current.row === data.row
    )
      ? true
      : false;
  }

  addPath(data: ID, previous: Path = null, next: Path = null) {
    const { row, column } = data;
    const obj = {
      row,
      column,
    };
    const inBounds = this.inBounds(row, column, previous);
    if (inBounds === false) return;
    const visited = this.visited(data, previous);
    if (visited === true) return;
    const element = this.map[row][column];
    const current =
      element !== 'S'
        ? element === 'E'
          ? 26
          : element.charCodeAt(0) - 96
        : element;
    const climbable = this.climbable(previous, current);
    if (climbable === false) return;
    const node = new Path(obj, current, element, previous, next);
    if (element === 'E') {
      this.paths.push(node);
      if (this.leastDistance === null) this.leastDistance = node;
      else if (this.leastDistance?.visited?.length > node.visited.length)
        this.leastDistance = node;
    }
    return node;
  }
}
