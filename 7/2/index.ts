import { processFile } from "../../process-file";
import { Dir, File, FileSystem, GraphNode } from "../Graph";

type Both = File | Dir;

const result = async () => {
  const stream = await processFile("7/data.txt");
  const root = new Dir("\\");
  const fs = new FileSystem(root);
  let current = fs.root;
  const nodes: Both[] = [];

  const updateDirSizes = (file: GraphNode<File>) => {
    let iter = file;
    fs.root.node.size += file.node.size;
    while (iter.previous !== null || iter.node !== fs.root.node) {
      if (iter.node.type === "dir") {
        iter.node.size += file.node.size;
      }
      nodes.push(iter.node);
      iter = iter.previous;
    }
  };

  for await (const line of stream) {
    if (line.includes("$ cd /")) continue;
    if (line.includes("$")) {
      // Process command
      if (line.includes("$ cd")) {
        const dir = line.replace("$ cd ", "");
        if (dir === "..") {
          current = current.previous;
        } else {
          const node = current.next?.find((curr) => curr?.node.name === dir);
          current = node;
        }
      }
    } else {
      if (line.includes("dir")) {
        const curr = line.replace("dir ", "");
        const dir = new Dir(curr);
        const node = fs.addDir(dir, current);
        current.next.push(node);
      } else {
        const [size, name] = line.split(" ");
        const file = new File(name, Number(size));
        const node = fs.addFile(file, current);
        if (current.node.type === "dir") {
          current.next.push(node);
        }
        updateDirSizes(node);
      }
    }
  }
  const MIN_SIZE = 30000000;
  const shouldFree = 70000000 - fs.root.node.size;
  const largeEnough = nodes.filter((dir) => dir.size >= shouldFree);
  const unique = largeEnough.filter((item, pos) => nodes.indexOf(item) == pos);
  const sorted = unique.sort((f, s) => f.size - s.size);
  return sorted[0].size;
};

result().then((data) => console.log(data));
