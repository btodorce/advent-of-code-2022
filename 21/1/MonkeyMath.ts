import { Both, Maybe } from '../../types';

class MonkeyNumber {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}

class MonkeyOperation {
  value?: {
    left: number;
    right: number;
    operation: string;
    result: number;
  } = {
    left: null,
    right: null,
    operation: null,
    result: null,
  };
  left: Both<MonkeyNumber, MonkeyOperation> = null;
  right: Both<MonkeyNumber, MonkeyOperation> = null;
}

export class MonkeyMath {
  monkeys: Map<string, any> = new Map();
  root: MonkeyOperation;

  setRoot() {
    const node = this.monkeys.get('root');
    if (node instanceof MonkeyOperation) {
      this.root = node;
      return;
    }
    throw new Error('The root node is not a MonkeyOperation');
  }
  addMonkey(name: string, value?: number) {
    const monkey = value ? new MonkeyNumber(value) : new MonkeyOperation();
    // this.monkeys.push(monkey);
    this.monkeys.set(name, monkey);
  }

  get(name: string) {
    return this.monkeys.get(name);
  }

  update(name: string, left: string, right: string, operation: string) {
    const node = this.get(name);
    // const leftNode = this.monkeys.find((m) => m.name === left);
    const leftNode = this.get(left);
    const rightNode = this.get(right);
    if (node instanceof MonkeyOperation) {
      node.left = leftNode;
      node.right = rightNode;
      node.value.operation = operation;
    }
  }

  private sibling(
    monkey: MonkeyOperation,
    direction: 'left' | 'right'
  ): number | null {
    if (direction === 'left') {
      if (monkey.left instanceof MonkeyNumber) {
        return monkey.left.value;
      }
      if (monkey.left?.value?.left) return monkey.left.value.left;
    }
    if (monkey.right instanceof MonkeyNumber) {
      return monkey.right.value;
    }
    if (monkey.right?.value?.right) return monkey.right.value.right;
    null;
  }

  private result(first: number, second: number, operation: string): number {
    switch (operation) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return first / second;
      default:
        throw new Error('Missed operation: ' + operation);
    }
  }

  updateValues() {
    // while (!this.root.value.right && !this.root.value.left) {
    for (const [key, monkey] of this.monkeys) {
      const left = this.sibling(monkey, 'left');
      const right = this.sibling(monkey, 'right');
      if (left && right) {
        const value = this.result(left, right, monkey.value.operation);
        monkey.value.left = left;
        monkey.value.right = right;
        monkey.value.result = value;
        continue;
      }
      if (left) {
        monkey.value.left = left;
      }
      if (right) {
        monkey.value.right = right;
      }
      const debug = true;
    }
    const debug = true;
  }
  // }
}
