import { Interface } from 'readline';
import { processFile } from '../../process-file';

const strip = (str: string) => Number(str.replace(/\D/g, ''));

type Materials = { clay: number; ore: number; obsidian: number };

type Robot = { name: string } & Materials;

type Blueprint = {
  id: number;
  robots: Robot[];
};

const parseInput = async (stream: Interface) => {
  const blueprints: Blueprint[] = [];

  for await (const line of stream) {
    const [blueprint, ore, clay, obsidian, geode] = line.split(/\.|: /);
    const id = strip(blueprint);
    const obsidianMaterials = obsidian
      .split('ore and')
      .map((str) => strip(str));
    const geodeMaterials = geode.split('ore and').map((str) => strip(str));
    const entry = {
      id,
      robots: [
        {
          name: 'ore',
          ore: strip(ore),
          clay: 0,
          obsidian: 0,
        },
        {
          name: 'clay',
          ore: strip(clay),
          clay: 0,
          obsidian: 0,
        },
        {
          name: 'obsidian',
          ore: obsidianMaterials[0],
          clay: obsidianMaterials[1],
          obsidian: 0,
        },
        {
          name: 'geode',
          ore: geodeMaterials[0],
          clay: 0,
          obsidian: geodeMaterials[1],
        },
      ],
    };
    entry.robots.sort((robot, next) => {
      const first = robot.ore + robot.clay + robot.obsidian;
      const second = next.ore + next.clay + next.obsidian;
      if (first < second) return 1;
      if (first > second) return -1;
      return 0;
    });
    blueprints.push(entry);
    return blueprints;
  }
};

const result = async () => {
  const TIMER = 24;
  const stream = await processFile('19/dummy.txt');
  const blueprints = await parseInput(stream);

  for (const blueprint of blueprints) {
    const robots = ['ore'];
    const materials = {
      ore: 0,
      clay: 0,
      obsidian: 0,
    };
    for (let minute = 1; minute <= TIMER; minute++) {
      // Try to construct a robot
      console.log(`== Minute ${minute} ==`);
      const newRobot = blueprint.robots.find((robot) => {
        const newOne =
          robot.ore === materials.ore &&
          robot.clay === materials.clay &&
          robot.obsidian === materials.obsidian;
        if (newOne) {
          materials.ore -= robot.ore;
          materials.clay -= robot.clay;
          materials.obsidian -= robot.obsidian;
          return robot;
        }
      });
      if (newRobot) {
        console.log(`Start building a ${newRobot.name}-collecting robot`);
      }

      // Let the robots work
      for (const robot of robots) {
        materials[robot] += 1;
        console.log(
          `1 ${robot}-collecting robot collects 1 ${robot}; you now have ${materials[robot]} ${robot}.`
        );
      }

      // Add the new robot to the robots array
      if (newRobot) {
        robots.push(newRobot.name);
      }
      const debug = true;
    }
    const debug = true;
  }

  const debug = true;
  return 0;
};

result().then((data) => console.log(data));
