// https://math.hws.edu/graphicsbook/source/glut/cubes-with-vertex-arrays.c

type Side = { x: number; y: number; z: number }[];

class Cube {
  x: number;
  y: number;
  z: number;
  faces: Side[];
  adjacent: Cube[];
  sides = 6;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.faces = this.calculateFaces(x, y, z);
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
    const first = [
      { x: x, y: y, z: z },
      { x: x - 1, y: y, z: z },
      { x: x - 1, y: y - 1, z: z },
      { x: x, y: y - 1, z: z },
    ];
    const second = [
      { x: x, y: y, z: z },
      { x: x, y: y - 1, z: z },
      { x: x, y: y - 1, z: z - 1 },
      { x: x, y: y, z: z - 1 },
    ];
    const third = [
      { x: x, y: y, z: z },
      { x: x, y: y, z: z - 1 },
      { x: x - 1, y: y, z: z - 1 },
      { x: x - 1, y: y, z: z },
    ];
    const fourth = [
      { x: x - 1, y: y - 1, z: z - 1 },
      { x: x - 1, y: y, z: z - 1 },
      { x: x, y: y, z: z - 1 },
      { x: x, y: y - 1, z: z - 1 },
    ];

    const fifth = [
      { x: x - 1, y: y - 1, z: z - 1 },
      { x: x - 1, y: y - 1, z: z },
      { x: x - 1, y: y, z: z },
      { x: x - 1, y: y, z: z - 1 },
    ];
    const sixth = [
      { x: x - 1, y: y - 1, z: z - 1 },
      { x: x, y: y - 1, z: z - 1 },
      { x: x, y: y - 1, z: z },
      { x: x - 1, y: y - 1, z: z },
    ];
    return [first, second, third, fourth, fifth, sixth];
  }
}

export class Grid {
  cubes: Cube[] = [];

  calculateSurfaceArea() {
    for (let current = 0; current < this.cubes.length; current++) {
      for (let next = current + 1; next < this.cubes.length; next++) {
        const faces = this.cubes[current].faces;
        const result = faces.filter((face) => {
          return this.cubes[next].faces.some((face2) =>
            face.every(({ x, y, z }) =>
              face2.some(
                ({ x: x2, y: y2, z: z2 }) => x === x2 && y === y2 && z === z2
              )
            )
          );
        });
        if (result.length > 0) {
          this.cubes[current].sides -= result.length;
          this.cubes[next].sides -= result.length;
        }
      }
    }
  }

  addCube(first: string, second: string, third: string) {
    const x = Number(first);
    const y = Number(second);
    const z = Number(third);
    const cube = new Cube(x, y, z);
    this.cubes.push(cube);
  }
}
