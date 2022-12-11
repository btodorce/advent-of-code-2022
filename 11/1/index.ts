import { Interface } from "readline";
import { processFile } from "../../process-file";

type MonkeyBusiness = {
  id: number;
  items: number[];
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

const processInput = async (stream: Interface): Promise<Monkey> => {
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
      items.forEach((item) => monkeys[current].items.push(Number(item)));
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

const result = async () => {
  const ROUNDS = 20;
  const stream = await processFile("11/data.txt");
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
      if (rounds?.[round - 1]?.monkeys?.[monkey.id]) {
        currentRound.monkeys[monkey.id] = {
          monkey: monkey.id,
          inspected: (rounds[round - 1].monkeys[monkey.id].inspected +=
            items.length ?? 0),
        };
      } else {
        currentRound.monkeys[monkey.id] = {
          monkey: monkey.id,
          inspected: items.length ?? 0,
        };
      }
      items.forEach((item) => {
        const first =
          operation.first === "old" ? item : Number(operation.first);
        const second =
          operation.second === "old" ? item : Number(operation.second);
        let worry = 0;

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
            console.log(operation.sign);
        }
        worry = Math.floor(worry / 3);
        const divisible = worry % monkey.test;
        const throwing = divisible === 0;
        const throwTo = throwing ? monkey.action.true : monkey.action.false;
        throwing
          ? monkeys[throwTo].items.push(worry)
          : monkeys[throwTo].items.push(worry);
      });
      monkey.items = [];
    }
    rounds.push(currentRound);
  }
  const [round, validMonkeys] = [...Object.values(rounds[ROUNDS - 1])];
  const monkeyBusiness = Object.values(validMonkeys).sort(
    (first: any, second: any) => (first.inspected > second.inspected ? 0 : 1),
  );
  const sum = monkeyBusiness[0].inspected * monkeyBusiness[1].inspected;
  return sum;
};

result().then((data) => console.log(data));
