import { Maybe } from "../../types";

enum Types {
  DIR = "dir",
  FILE = "file",
}

export class File {
  name: string;
  size: number;
  type: Types.FILE;
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

export class Dir {
  name: string;
  type: Types.DIR;
  size: number = 0;
  constructor(name: string) {
    this.name = name;
  }
}

export class GraphNode {
  node: File | Dir;
  next?: Maybe<GraphNode[]>;
  previous?: Maybe<GraphNode>;
  constructor(data: File | Dir, previous: Maybe<GraphNode> = null) {
    this.node = data;
    if (data.type === Types.DIR) {
      this.next = [];
    }
    if (data.type === Types.FILE) {
      this.next = null;
    }
    this.previous = previous;
  }
}

export class FileSystem {
  root: GraphNode;
  constructor(data: Dir) {
    this.root = new GraphNode(data, null);
    this.root.next = [];
  }

  addFile(file: File, previous: GraphNode) {
    const obj = {
      name: file.name,
      size: file.size,
      type: Types.FILE,
    };
    const node = new GraphNode(file, previous);
    return node;
  }

  addDir(dir: Dir, previous: GraphNode) {
    const obj = {
      name: dir.name,
      size: dir.size ?? 0,
      type: Types.DIR,
    };
    const node = new GraphNode(obj, previous);
    return node;
  }
}
