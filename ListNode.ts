import { Maybe } from './types';

export class ListNode<E> {
  value: E;
  next: Maybe<ListNode<E>> = null;
  prev: Maybe<ListNode<E>> = null;
  constructor(
    value: E,
    next: Maybe<ListNode<E>> = null,
    prev: Maybe<ListNode<E>> = null
  ) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}
