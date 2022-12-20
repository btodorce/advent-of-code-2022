import { processFile } from '../../process-file';
import { GroovePositioningSystem } from '../GroovePositioningSystem';

const result = async () => {
  const stream = await processFile('20/dummy.txt');
  const list = new GroovePositioningSystem();
  const instructions = [];
  for await (const line of stream) {
    list.addNode(line);
    instructions.push(line);
  }
  list.head.prev = list.tail;
  list.tail.next = list.head;
  list.initial = list.head;
  list.print();
  for (const instruction of instructions) {
    list.adjust(instruction);
  }
  const debug = true;
  list.coordinates(0);
  return 0;
};

result().then();
