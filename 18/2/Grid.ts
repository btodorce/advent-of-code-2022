// https://math.hws.edu/graphicsbook/source/glut/cubes-with-vertex-arrays.c

class Cube {
  x: number;
  y: number;
  z: number;
  faces: {
    first: { x: number; y: number; z: number };
    second: { x: number; y: number; z: number };
    third: { x: number; y: number; z: number };
    fourth: { x: number; y: number; z: number };
  }[];
  adjacent: Cube[];
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.faces = this.calculateFaces(x, y, z);
  }

  connected(comparing: Cube) {
    const connected = [];

    for (const face of this.faces) {
      for (const comparingFace of comparing.faces) {
        if (face === comparingFace) {
          const debug = true;
        } else {
          const debug = true;
        }
      }
    }
    const notConnected = 6 - connected.filter((c) => c).length;
    return { connected, notConnected };
  }
  /**
   * Faces of a cube
   *
   *  1,1,1,   0,1,1,    0,0,1,    1,0,1,   // face #1
   *  1,1,1,   1,0,1,    1,0,0,    1,1,0,   // face #2
   *  1,1,1,   1,1,0,    0,1,0,    0,1,1,   // face #3
   *  0,0,0,   0,1,0,    1,1,0,    1,0,0,   // face #4
   *  0,0,0,   0,0,1,    0,1,1,    0,1,0,   // face #5
   *  0,0,0,   1,0,0,    1,0,1,    0,0,1    // face #6
   *
   */
  private calculateFaces(x: number, y: number, z: number) {
    const first = {
      first: { x: x, y: y, z: z },
      second: { x: x - 1, y: y, z: z },
      third: { x: x - 1, y: y - 1, z: z },
      fourth: { x: x, y: y - 1, z: z },
    };
    const second = {
      first: { x: x, y: y, z: z },
      second: { x: x, y: y - 1, z: z },
      third: { x: x, y: y - 1, z: z - 1 },
      fourth: { x: x, y: y, z: z - 1 },
    };
    const third = {
      first: { x: x, y: y, z: z },
      second: { x: x, y: y, z: z - 1 },
      third: { x: x - 1, y: y, z: z - 1 },
      fourth: { x: x - 1, y: y, z: z },
    };
    const fourth = {
      first: { x: x - 1, y: y - 1, z: z - 1 },
      second: { x: x - 1, y: y, z: z - 1 },
      third: { x: x, y: y, z: z - 1 },
      fourth: { x: x, y: y - 1, z: z - 1 },
    };
    const fifth = {
      first: { x: x - 1, y: y - 1, z: z - 1 },
      second: { x: x - 1, y: y - 1, z: z },
      third: { x: x - 1, y: y, z: z },
      fourth: { x: x - 1, y: y, z: z - 1 },
    };
    const sixth = {
      first: { x: x - 1, y: y - 1, z: z - 1 },
      second: { x: x, y: y - 1, z: z - 1 },
      third: { x: x, y: y - 1, z: z },
      fourth: { x: x - 1, y: y - 1, z: z },
    };
    return [first, second, third, fourth, fifth, sixth];
  }
}

export class Grid {
  cubes: Cube[] = [];

  addCube(first: string, second: string, third: string) {
    const x = Number(first);
    const y = Number(second);
    const z = Number(third);
    const cube = new Cube(x, y, z);
    this.cubes.push(cube);
  }
  surfaceArea() {
    let surfaceArea = 0;
    const connected = [];
    let notConnected = 0;
    for (const cube of this.cubes) {
      const rest = this.cubes.filter((c) => c !== cube);
      for (const comparing of rest) {
        const { connected: nestedConnected, notConnected: nestedNotConnected } =
          cube.connected(comparing);
        connected.push(...nestedConnected);

        const debug = true;
      }
    }
    return surfaceArea;
  }
}
