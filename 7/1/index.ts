import { processFile } from "../../process-file";
import { Dir, File, FileSystem } from "./Graph";

const result = async () => {
  const stream = await processFile("7/dummy.txt");
  const root = new Dir("\\");
  const fs = new FileSystem(root);
  let current = fs.root;
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
        fs.root.node.size += node.node.size;
      }
    }
  }
  return current;
};

result().then((data) => console.log(data));
