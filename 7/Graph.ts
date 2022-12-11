import { Maybe } from "../types";

enum Types {
  DIR = "dir",
  FILE = "file",
}

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

type Node = Dir | File;

export class FileSystem {
  root: GraphNode<Dir>;
  nodes: Node[] = [];
  constructor(data: Dir) {
    this.root = new GraphNode(data, null);
    this.root.next = [];
  }

  private updateNodeSizes(file: GraphNode<File>) {
    let iter = file;
    this.root.node.size += file.node.size;
    while (iter.previous !== null || iter.node !== this.root.node) {
      if (iter.node.type === "dir") {
        iter.node.size += file.node.size;
      }
      this.nodes.push(iter.node);
      iter = iter.previous;
    }
  }

  addFile(file: File, previous: GraphNode<Dir>) {
    const obj = {
      name: file.name,
      size: file.size,
      type: Types.FILE,
    };
    const node = new GraphNode(obj, previous);
    this.updateNodeSizes(node);
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
