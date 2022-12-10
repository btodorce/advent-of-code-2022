import { Maybe } from "../../types";

enum Types {
  DIR = "dir",
  FILE = "file",
}

type ChildrenNode = {
  name: string;
  size: number;
};

type LargeFiles = {
  [id: string]: {
    children: ChildrenNode[];
  };
};

export class File {
  name: string;
  size: number;
  type = Types.FILE;
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

export class Dir {
  name: string;
  type = Types.DIR;
  size: number = 0;
  constructor(name: string) {
    this.name = name;
  }
}

export class GraphNode<E extends File | Dir> {
  node: E;
  next?: Maybe<GraphNode<E>[]>;
  previous?: Maybe<GraphNode<E>>;
  constructor(data: E, previous: Maybe<GraphNode<E>> = null) {
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
  root: GraphNode<Dir>;
  constructor(data: Dir) {
    this.root = new GraphNode(data, null);
    this.root.next = [];
  }

  addFile(file: File, previous: GraphNode<Dir>) {
    const obj = {
      name: file.name,
      size: file.size,
      type: Types.FILE,
    };
    const node = new GraphNode(obj, previous);
    let iter = node;
    return node;
  }

  addDir(dir: Dir, previous: GraphNode<Dir>) {
    const obj = {
      name: dir.name,
      size: dir.size ?? 0,
      type: Types.DIR,
    };
    const node = new GraphNode(obj, previous);
    return node;
  }
}
