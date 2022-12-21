import { ListNode } from './ListNode';
import { Maybe } from './types';

export class LinkedList<E> {
  head: Maybe<ListNode<E>> = null;
  tail: Maybe<ListNode<E>> = null;

  addNode(value: E) {
    const node = new ListNode<E>(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
  }
}
