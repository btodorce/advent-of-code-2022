import { processFile } from "../../process-file";
import { Dir, File, FileSystem } from "./Graph";

const result = async () => {
  const stream = await processFile("7/data.txt");
  const root = new Dir("\\");
  const fs = new FileSystem(root);
  let current = fs.root;
  for await (const line of stream) {
    if (current.node.type === "dir") {
      current.next = [];
    }
    if (line.includes("$ cd /")) continue;
    if (line.includes("$")) {
      // Process command
      if (line.includes("$ cd")) {
        const dir = line.replace("$ cd ", "");
        if (dir === "..") {
          current = current.previous;
        } else {
          const node = current.next?.find((curr) => curr?.node?.name === dir);
          node.next = [];
          node.previous = current;
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
        node.previous = current;
        fs.root.node.size += node.node.size;
        let iterator = current;
        while (
          (iterator.previous.node !== fs.root.node ||
            iterator.previous.node !== null) &&
          iterator.previous.node.type === "dir"
        ) {
          iterator.node.size += node.node.size;
          iterator = iterator.previous;
        }
        current.next.push(node);
      }
    }
  }
  console.log(current);
};

result().then();
