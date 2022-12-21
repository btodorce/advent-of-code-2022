import { processFile } from '../../process-file';
import { MonkeyMath } from './MonkeyMath';

type MonkeyOperation = {
  name: string;
  value?: number;
  operation: string;
  left: string;
  right: string;
};

type Instruction = MonkeyOperation;

const result = async () => {
  const stream = await processFile('21/dummy.txt');
  const data = new MonkeyMath();
  const instructions: Instruction[] = [];
  for await (const line of stream) {
    const [name, _, first, operation, second] = line.split(/\:| /);
    if (!operation && !second) {
      data.addMonkey(name, Number(first));
      continue;
    }
    data.addMonkey(name);
    instructions.push({ name, operation, left: first, right: second });
  }
  for (const instruction of instructions) {
    data.update(
      instruction.name,
      instruction.left,
      instruction.right,
      instruction.operation
    );
  }
  data.setRoot();
  data.updateValues();
  const debug = true;

  return 0;
};

result().then();
