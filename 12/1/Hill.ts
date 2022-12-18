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
  private map: any[] = [];
  private adjacents: Map<string, ID[]>;
  visited: ID[] = [];
  constructor(map: any[]) {
    this.adjacents = new Map();
    this.map = map;
    for (let row = 0; row < map.length; row++) {
      for (let column = 0; column < map[row].length; column++) {
        this.addLocation({ row, column });
      }
    }
  }

  private getData(node: ID) {
    const { row, column } = node;
    const char = this.map[row][column];
    const value =
      char !== 'S' ? (char === 'E' ? 26 : char.charCodeAt(0) - 96) : char;
    return { char, value };
  }

  private climbable(node: ID, current: ID) {
    if (node === null) return true;
    const { char, value } = this.getData(node);
    const { value: data } = this.getData(current);
    if (char === 'E') return false;
    if (data === 'S') return false;
    if (typeof data === 'number') {
      const compare = value === 'S' ? 0 : Number(value);
      if (data - compare <= 1) return true;
    }
    return false;
  }

  private getKey(path: ID) {
    const key = `${path.row}${path.column}`;
    return key;
  }

  private inBounds(row: number, column: number) {
    if (row < 0 || row > this.map.length - 1) return false;
    if (column < 0 || column > this.map[row].length - 1) return false;
    return true;
  }

  addLocation(data: ID) {
    const key = this.getKey(data);
    this.adjacents.set(key, []);
  }

  addPath(path: ID, previous: ID) {
    const { row, column } = path;
    const inBounds = this.inBounds(row, column);
    if (inBounds === false) {
      return;
    }
    const visited = this.visited.find(
      (node) => node.row === row && node.column === column
    );
    if (visited) {
      return;
    }
    const climbable = this.climbable(previous, path);
    if (climbable === false) {
      return;
    }
    const key = this.getKey(path);
    const prevKey = this.getKey(previous);
    this.adjacents.get(key).push(previous);
    this.adjacents.get(prevKey).push(path);
    this.visited.push(previous);
    return path;
  }
}
