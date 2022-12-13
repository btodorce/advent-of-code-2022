import { Both, Maybe } from '../../types';

type ID = {
  row: number;
  column: number;
};

const signs = ['S', 'H'];

export class Path {
  data: ID;
  value: string | number;
  char: string;
  steps: number;
  previous: Maybe<Path>;
  next: Path;
  constructor(
    data: ID,
    value: string | number,
    char: string,
    steps: number,
    previous: Path,
    next: Path
  ) {
    this.data = data;
    this.steps = steps;
    this.char = char;
    this.value = value;
    this.previous = previous;
    this.next = next;
    this.steps = steps;
  }
}

const chars = ['S', 'U'];

export class Hill {
  // steps = weight of Path, starting weight is 0 for root Path
  root: Path;
  stack: Path[] = [];
  paths = [];
  map: any[] = [];

  private visited(node: Path, current: { row: number; column: number }) {
    if (node === null || node?.previous === null) return false;
    let iter = node;
    const { row, column } = current;
    while (iter !== null) {
      if (iter.data.column === column && iter.data.row === row) return true;
      if (iter.previous === null || iter.previous.char === 'S') break;
      iter = iter.previous;
    }
    return false;
  }

  private climbable(node: Path, data: string | number) {
    if (node === null) return true;
    const { char, value } = node;
    if (char === 'E') return false;
    if (data === 'E') {
      return true;
    }
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

  addPath(data: ID, previous: Path = null, next: Path = null) {
    const { row, column } = data;
    const obj = {
      row,
      column,
    };
    const specials = ['S', 'E'];
    const inBounds = this.inBounds(row, column, previous);
    if (inBounds === false) return;
    const element = this.map[row][column];
    if (element === 'E')
      this.paths.push(
        new Path(obj, 'E', 'E', previous.steps + 1, previous, next)
      );
    const current =
      typeof element === 'string' && !specials.includes(element)
        ? element.charCodeAt(0) - 96
        : element;
    const climbable = this.climbable(previous, current);
    if (climbable === false) return;
    if (previous !== null) {
      const wasVisited = this.visited(previous, data);
      if (wasVisited) return;
    }
    const steps = previous === null ? 0 : previous?.steps + 1;
    const node = new Path(obj, current, element, steps, previous, next);
    const debug = 'as';
    return node;
  }
}
