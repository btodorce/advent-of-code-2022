import { Both, Maybe } from '../../types';

type ID = {
  row: number;
  column: number;
};

export class Path {
  data: ID;
  value: string | number;
  steps: number;
  previous: Maybe<Path>;
  next: Path;
  constructor(
    data: ID,
    value: string | number,
    steps: number,
    previous: Path,
    next: Path
  ) {
    this.data = data;
    this.value = value;
    this.previous = previous;
    this.next = next;
    this.steps = steps;
  }
}

export class Hill {
  // steps = weight of Path, starting weight is 0 for root Path
  paths: Path & { steps: number[] };
  root: Path;

  private visited(node: Path, next: { row: number; column: number }) {
    let iter = node;
    const { row, column } = next;
    while (iter !== null) {
      if (iter.data.column === column && iter.data.row === row) return true;
      if (iter.previous === null) break;
      iter = iter.previous;
    }
    return false;
  }

  private climbable(node: Path, data: string | number) {
    const { value } = node;
    if (value === 'E') return false;
    if (data === 'E') return true;
    if (data === 'S') return false;
    if (typeof data === 'number') {
      const compare = value === 'S' ? 0 : Number(value);
      if (data - compare < 1) return true;
    }
    return true;
  }

  addPath(
    data: ID,
    element: string | number,
    previous: Path = null,
    next: Path = null
  ) {
    const { row, column } = data;
    const obj = {
      row,
      column,
    };
    const steps = previous !== null ? previous.steps + 1 : 0;
    const canBeClimbed = this.climbable(previous, element);
    if (!canBeClimbed) return;
    const wasVisited = this.visited(previous, data);
    if (wasVisited) return;
    const node = new Path(obj, element, steps, previous, next);
    return node;
  }
}
