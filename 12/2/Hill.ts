type ID = {
  row: number;
  column: number;
};

export class Path {
  data: ID;
  value: string | number;
  char: string;
  steps: number;
  constructor(data: ID, value: string | number, char: string) {
    this.data = data;
    this.char = char;
    this.value = value;
  }
}

export class Hill {
  private root: Path;
  private map: any[] = [];
  private adjacents: Map<Path, []> = new Map();
  constructor(map: any[]) {
    this.map = map;
    for (let row = 0; row < map.length; row++) {
      for (let column = 0; column < map[row].length; column++) {
        this.addLocation({ row, column });
      }
    }
  }

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

  addLocation(data: ID) {
    const { row, column } = data;
    const element = this.map[row][column];
    const id = {
      row,
      column,
    };
    const current =
      element !== 'S'
        ? element === 'E'
          ? 26
          : element.charCodeAt(0) - 96
        : element;
    const node = new Path(id, current, element);
    this.adjacents.set(node, []);
  }

  addPath(data: ID, previous: Path = null, next: Path = null) {
    const { row, column } = data;
    const obj = {
      row,
      column,
    };
    const inBounds = this.inBounds(row, column, previous);
    if (inBounds === false) return;

    const element = this.map[row][column];
    const current =
      element !== 'S'
        ? element === 'E'
          ? 26
          : element.charCodeAt(0) - 96
        : element;

    const node = new Path(obj, current, element);
    this.adjacents.set(node, []);
    return node;
  }
}
