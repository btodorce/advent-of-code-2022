import { processFile } from "../../process-file";
import { RopeBridge } from "./RopeBridge";

const result = async () => {
  const stream = await processFile("9/dummy.txt");
  const bridge = new RopeBridge(10);

  for await (const line of stream) {
    const [direction, pos] = line.split(" ");
    const steps = Number(pos);
    if (direction === "R") {
      bridge.moveRight(steps);
    } else if (direction === "L") {
      bridge.moveLeft(steps);
    } else if (direction === "U") {
      bridge.moveUp(steps);
    } else if (direction === "D") {
      bridge.moveDown(steps);
    }
    const debug = "sas";
  }
  return bridge.visited();
};

result().then((data) => console.log(data));
