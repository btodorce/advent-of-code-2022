export type ID = {
  row: number;
  column: number;
};

class Node {
  data: ID;
  value: string | number;
  char: string;
  adjacents: Node[] = [];
  constructor(data: ID, value: string | number, char: string) {
    this.data = data;
    this.char = char;
    this.value = value;
  }

  addAdjacent(node: Node) {
    this.adjacents.push(node);
  }
  isAdjacent(node: Node) {
    const { row, column } = node.data;
    const found = this.adjacents.find(
      (item) => item.data.row === row && item.data.column === column
    );
    return found !== undefined;
  }
}

export class Hill {
  private map: any[] = [];
  private nodes: Map<string, Node>;
  validPath: [];
  constructor(map: any[], root: ID) {
    this.map = map;
    this.nodes = new Map();
    for (let row = 0; row < map.length; row++) {
      for (let column = 0; column < map[row].length; column++) {
        this.addLocation({ row, column });
      }
    }
  }

  paths() {
    const sum = [];
    for (const [_, node] of this.nodes) {
      const queue = [];
      queue.push(node);
      const visited = [];
      while (queue.length > 0) {
        const current = queue.shift();
        const { row, column } = current.data;
        const { char } = current;
        const exists = visited.find(
          (item) => item.column === column && item.row === row
        );
        if (exists !== undefined) continue;
        visited.push({ row, column });
        if (char === 'E') {
          const depth = visited.length - 1;
          sum.push(node, depth);
          break;
        }
        current.adjacents.forEach((item: Node) => queue.push(item));
      }
    }
    return sum;
  }

  // Depth first search
  dfs() {
    const stack = [];
    const root = this.getLocation({ row: 0, column: 0 });
    stack.push(root);
    const visited = [];
    while (stack.length > 0) {
      const node = stack.pop();
      const { row, column } = node.data;
      const { char } = node;
      const exists = visited.find(
        (item) => item.column === column && item.row === row
      );
      if (exists !== undefined) continue;
      visited.push({ row, column });
      if (char === 'E') {
        const depth = visited.length - 1;
        return depth;
      }
      node.adjacents.forEach((item: Node) => stack.push(item));
    }
  }

  bfs() {
    const queue = [];
    const root = this.getLocation({ row: 0, column: 0 });
    queue.push(root);
    const visited = [];
    while (queue.length > 0) {
      const node = queue.shift();
      const { row, column } = node.data;
      const { char } = node;
      const exists = visited.find(
        (item) => item.column === column && item.row === row
      );
      if (exists !== undefined) continue;
      visited.push({ row, column });
      if (char === 'E') {
        const depth = visited.length - 1;
        return depth;
      }
      node.adjacents.forEach((item: Node) => queue.push(item));
    }
  }

  private getLocation(path: ID) {
    const key = this.getKey(path);
    return this.nodes.get(key);
  }

  private updateLocation(node: Node) {
    const { row, column } = node.data;
    const key = this.getKey({ row, column });
    this.nodes.set(key, node);
  }

  addLocation(path: ID) {
    const { row, column } = path;
    const char = this.map[row][column];
    const value =
      char !== 'S' ? (char === 'E' ? 26 : char.charCodeAt(0) - 96) : char;

    const key = this.getKey(path);
    const node = new Node(path, value, char);
    this.nodes.set(key, node);
  }

  addPath(source: ID, destination: ID) {
    const { row, column } = destination;
    const inBounds = this.inBounds(row, column);
    if (inBounds === false) {
      return;
    }
    const climbable = this.climbable(source, destination);
    if (climbable === false) {
      return;
    }
    const sourceNode = this.getLocation(source);
    const destinationNode = this.getLocation(destination);
    if (sourceNode.isAdjacent(destinationNode)) {
      return;
    }
    sourceNode.addAdjacent(destinationNode);
    this.updateLocation(sourceNode);
  }

  private climbable(node: ID, current: ID) {
    if (node === null) return true;
    const { value } = this.getLocation(node);
    const { value: data } = this.getLocation(current);
    if (data === 'E') {
      return false;
    }
    if (data === 'S') {
      return false;
    }
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
}
