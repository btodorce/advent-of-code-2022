import { Maybe } from "../../types";

export class File {
  name: string;
  size: number;
  type = "file";
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

export class Dir {
  name: string;
  type = "dir";
  size: number = 0;
  constructor(name: string) {
    this.name = name;
  }
}

export class GraphNode implements Iterable<GraphNode> {
  node: File | Dir;
  next?: Maybe<GraphNode>[];
  previous?: Maybe<GraphNode>;
  constructor(
    data: File | Dir,
    previous: Maybe<GraphNode> = null,
    next?: Maybe<GraphNode>,
  ) {
    this.node = data;
    if (this.node.type === "dir") {
      this.previous = previous;
      if (this.next === null) {
        this.next = [];
      }
      this.next.push(next);
    }
    if (this.node.type === "file") {
      this.previous = previous;
    }
  }
  *[Symbol.iterator](): Iterator<GraphNode> {
    yield this;
  }
}

export class FileSystem {
  root: GraphNode;
  constructor(data: Dir) {
    this.root = new GraphNode(data, null);
    this.root.next = [];
    this.root.previous = null;
  }

  addFile(file: File, previous: GraphNode) {
    const node = new GraphNode(file, previous);
    return node;
  }

  addDir(dir: Dir, previous: GraphNode, next: Maybe<GraphNode> = null) {
    const node = new GraphNode(dir, previous, next);
    return node;
  }
}
