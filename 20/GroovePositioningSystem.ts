import { LinkedList, ListNode } from '../LinkedList';
import { Maybe } from '../types';

export class GroovePositioningSystem extends LinkedList<string> {
  initial: Maybe<ListNode<string>> = null;

  adjust(instruction: string) {
    const value = Number(instruction);
    if (value === 0) {
      return;
    }
    const direction = Math.sign(value) === 1 ? 'right' : 'left';
    const steps = Math.abs(value);
    const current = this.find(value, this.initial);
    const temp = current.value;
    let iter = current;
    let counter = 0;
    while (counter < steps) {
      if (direction === 'right') {
        if (iter.next === null) iter.next = this.head;
        iter = iter.next;
      } else {
        if (iter.prev === null) iter.prev = this.tail;
        iter = iter.prev;
      }
      counter++;
    }
    current.value = iter.value;
    iter.value = temp;
    this.print();
    const debug = true;
  }

  find(
    needle: number,
    node: ListNode<string> = this.head
  ): Maybe<ListNode<string>> {
    let iter = node;
    while (iter !== null) {
      const current = Number(iter.value);
      if (current === needle) return iter;
      iter = iter.next;
    }
    return null;
  }

  coordinates(number: number) {
    let first = this.find(number);
    const match = [1000, 2000, 3000];
    const MAX = 3000;
    let counter = 0;
    const list = [];
    while (counter <= MAX) {
      if (match.includes(counter)) {
        list.push(first.value);
      }
      first = first.next;
      counter++;
    }
    const sum = list.reduce((acc, v) => acc + v, 0);
    const debug = true;
  }
  print() {
    let iter = this.head;
    let data = '';
    while (true) {
      data += iter.value + ' ,';
      if (iter.next === this.head) break;
      iter = iter.next;
    }
    console.log(data);
  }
}
