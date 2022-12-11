import { Interface } from "readline";
import { processFile } from "../../process-file";

type MonkeyBusiness = {
  id: number;
  items: bigint[];
  operation?: {
    result: string;
    sign: string;
    first: string;
    operand: string;
    second: string;
  };
  test: number;
  action: {
    true: number;
    false: number;
  };
};

type Monkey = {
  [id: number]: MonkeyBusiness;
};

type MonkeyInARound = { monkey: number; inspected: number };

type Round = {
  round: number;
  monkeys: {
    [monkey: number]: MonkeyInARound;
  };
};

const processInput = async (stream: Interface) => {
  const monkeys: Monkey = [];
  let current = 0;

  const addNewMonkey = (id: number) => {
    monkeys[id] = {
      id: id,
      items: [],
      operation: null,
      test: null,
      action: {
        true: null,
        false: null,
      },
    };
  };

  for await (const line of stream) {
    if (line.includes("Monkey")) {
      const [_, next] = line.split(" ");
      const id = Number(next.replace(":", ""));
      if (!monkeys[id]) addNewMonkey(id);
      if (current !== id) current = id;
    } else if (line.includes("Starting items:")) {
      const items = line
        .replace("Starting items:", "")
        .replace(" ", "")
        .split(",");
      items.forEach((item) => monkeys[current].items.push(BigInt(item)));
    } else if (line.includes("Operation:")) {
      const [_, result, sign, first, operand, second] = line
        .replace("Operation: ", "")
        .replace(" ", "")
        .split(" ");
      monkeys[current].operation = {
        result,
        sign,
        first,
        operand,
        second,
      };
      const f = Number(first);
      const s = Number(second);
    } else if (line.includes("Test:")) {
      const action = line
        .replace("Test: divisible by", "")
        .replace(" ", "")
        .split(",");
      const divisible = Number(action);
      monkeys[current].test = divisible;
    } else if (line.includes("If true:")) {
      const action = line
        .replace("If true: throw to monkey", "")
        .replace(" ", "");
      const toWhom = Number(action);
      monkeys[current].action.true = toWhom;
    } else if (line.includes("If false:")) {
      const action = line
        .replace("If false: throw to monkey", "")
        .replace(" ", "");
      const toWhom = Number(action);
      monkeys[current].action.false = toWhom;
    }
  }
  return monkeys;
};

const debug = [
  0, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 1000,
];

const result = async () => {
  const ROUNDS = 10000;
  const stream = await processFile("11/dummy.txt");
  const data = await processInput(stream);
  const rounds: Round[] = [];

  for (let round = 0; round < ROUNDS; round++) {
    const monkeys = [...Object.values(data)];
    const currentRound: Round = {
      round,
      monkeys: {},
    };
    for (let monkey of monkeys) {
      const { action, items, test, operation } = monkey;
      let inspected = rounds?.[round - 1]?.monkeys?.[monkey.id]?.inspected ?? 0;
      items.forEach((item) => {
        inspected++;
        const first =
          operation.first === "old" ? BigInt(item) : BigInt(operation.first);
        const second =
          operation.second === "old" ? BigInt(item) : BigInt(operation.second);
        let worry = BigInt(0);

        switch (operation.operand) {
          case "+":
            worry = first + second;
            break;
          case "-":
            worry = first - second;
            break;
          case "*":
            worry = first * second;
            break;
          case "/":
            worry = first / second;
            break;
          default:
            console.error(operation.sign);
            throw new Error(`${operation.operand} not supported`);
        }
        const divisible = worry % BigInt(monkey.test);
        const throwing = divisible === BigInt(0);
        const throwTo = throwing ? monkey.action.true : monkey.action.false;
        throwing
          ? monkeys[throwTo].items.push(worry)
          : monkeys[throwTo].items.push(worry);
      });
      currentRound.monkeys[monkey.id] = {
        monkey: monkey.id,
        inspected,
      };
      monkey.items = [];
    }
    if (debug.includes(round)) {
      const debugging = "as";
    }
    rounds.push(currentRound);
  }
  const [_, validMonkeys] = [...Object.values(rounds[ROUNDS - 1])];
  const monkeyBusiness = Object.values(validMonkeys).sort(
    (first: any, second: any) => (first.inspected > second.inspected ? 0 : 1),
  );
  const sum = monkeyBusiness[0].inspected * monkeyBusiness[1].inspected;
  return sum;
};

result().then((data) => console.log(data));
