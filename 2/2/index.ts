import { processFile } from "../../process-file";

enum Enemy {
  "A" = "rock",
  "B" = "paper",
  "C" = "scissors",
}
enum Shape {
  "rock" = 1,
  "paper" = 2,
  "scissors" = 3,
}

enum Win {
  "rock" = "paper",
  "paper" = "scissors",
  "scissors" = "rock",
}
enum Lose {
  "scissors" = "paper",
  "paper" = "rock",
  "rock" = "scissors",
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
    let shouldPlay = "";
    const enemyHand = Enemy[enemy];
    if (me === "X") shouldPlay = Lose[enemyHand];
    else if (me === "Z") shouldPlay = Win[enemyHand];
    else shouldPlay = enemyHand;
    const result = round(Enemy[enemy], shouldPlay) + Shape[shouldPlay];
    score += result;
  }

  const debug = "true";
  return score;
};

result().then((data) => console.log(data));
