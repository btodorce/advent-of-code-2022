import { processFile } from "../../process-file";

enum Enemy {
  "A" = "rock",
  "B" = "paper",
  "C" = "scissors",
}

enum Me {
  "Y" = "paper",
  "X" = "rock",
  "Z" = "scissors",
}

enum Shape {
  "rock" = 1,
  "scissors" = 3,
  "paper" = 2,
}

const round = (enemy: string, me: string): number => {
  if (me === enemy) return 3;
  if (me === "rock" && enemy === "scissors") return 6;
  if (me === "paper" && enemy === "rock") return 6;
  if (me === "scissors" && enemy === "paper") return 6;
  return 0;
};

const result = async () => {
  const stream = await processFile("2/data.txt");
  let score = 0;

  for await (const line of stream) {
    const [enemy, me] = line.split(" ");
    const enemyHand = Enemy[enemy];
    const myHand = Me[me];
    const result = round(Enemy[enemy], Me[me]);
    const handPoints = Number(Shape[myHand]);
    score += result + handPoints;
  }

  const debug = "true";
  return score;
};

result().then((data) => console.log(data));
