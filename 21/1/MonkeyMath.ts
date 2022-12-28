// @ts-nocheck
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
    this.monkeys.set(name, monkey);
  }

  get(name: string) {
    return this.monkeys.get(name);
  }

  update(name: string, left: string, right: string, operation: string) {
    const node = this.get(name);
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
      if (
        monkey.left instanceof MonkeyNumber &&
        monkey.right instanceof MonkeyNumber
      ) {
        return this.result(
          monkey.left.value,
          monkey.right.value,
          monkey.value.operation
        );
      }
      if (monkey.left?.value?.left) {
        return monkey.left.value;
      }
    }
    if (monkey.right instanceof MonkeyNumber) {
      return monkey.right.value;
    }
    if (monkey.right?.value?.right) {
      return monkey.right.value.right;
    }
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
    while (!this.root.left?.value?.result && !this.root.right?.value.result) {
      for (const [key, monkey] of this.monkeys) {
        const left = this.sibling(monkey, 'left');
        const right = this.sibling(monkey, 'right');
        if (left && right) {
          const value = this.result(left, right, monkey.value.operation);
          monkey.value.left = left;
          monkey.value.right = right;
          monkey.value.result = value;
          this.monkeys.set(key, monkey);
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
    }
    const left = this.root.left as any;
    const right = this.root.right as any;
    const sum = this.result(
      left.value.result,
      right.value.result,
      this.root.value.operation
    );
    return sum;
    const debug = true;
  }
}
