import { Maybe } from '../../types';

class Valve {
  open = false;
  name: string;
  flow: number;
  previous: Maybe<Valve>;
  next: Maybe<Valve>[] = [];
  constructor(
    name: string,
    flow: number = null,
    previous: Maybe<Valve> = null
  ) {
    this.name = name;
    this.flow = flow;
    this.previous = previous;
  }
  addValve(valve: Valve) {
    this.next.push(valve);
  }
}

export class PressureSystem {
  valves: Valve[] = [];
  root: Maybe<Valve> = null;

  addValve(valve: { name: string; flow: number }, previous: string) {
    const previousValve = this.dfs(previous);
    const newValve = new Valve(valve.name, valve.flow, previousValve);
    previousValve.addValve(newValve);
    const debug = true;
  }

  setRoot(name: string, flow: number) {
    this.root = new Valve(name, flow);
  }

  private dfs(name: string) {
    const visited = new Map();
    const stack: Valve[] = [];
    if (this.root.name === name) return this.root;
    stack.push(this.root);
    while (stack.length !== 0) {
      const valve = stack.shift();
      if (valve && !visited.has(valve.name)) {
        if (valve.name === name) return valve;
        visited.set(valve.name, valve);
        valve.next.forEach((current) => stack.push(current));
      }
    }
    return null;
  }
}
