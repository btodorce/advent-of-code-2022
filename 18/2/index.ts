// https://math.hws.edu/graphicsbook/source/glut/cubes-with-vertex-arrays.c

type Point = {
  x: number;
  y: number;
  z: number;
};

type Face = {
  first: Point;
  second: Point;
  third: Point;
  fourth: Point;
};

class Cube {
  x: number;
  y: number;
  z: number;
  faces?: Face[];
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.faces = this.calculateFaces(x, y, z);
  }
  /**
   * 1,1,1,   0,1,1,    0,0,1,    1,0,1,     // face #1
   */
  private firstFace(x: number, y: number, z: any) {
    return {
      first: { x: x, y: y, z: z },
      second: { x: x - 1, y: y, z: z },
      third: { x: x - 1, y: y - 1, z: z },
      fourth: { x: x, y: y - 1, z: z },
    };
  }
  /**
   * 1,1,1,   1,0,1,    1,0,0,    1,1,0,      // face #2
   */
  private secondFace(x: number, y: number, z: number) {
    return {
      first: { x: x, y: y, z: z },
      second: { x: x, y: y - 1, z: z },
      third: { x: x, y: y - 1, z: z - 1 },
      fourth: { x: x, y: y, z: z - 1 },
    };
  }
  /**
   * 1,1,1,   1,1,0,    0,1,0,    0,1,1,       // face #3
   */
  private thirdFace(x: number, y: number, z: number) {
    return {
      first: { x: x, y: y, z: z },
      second: { x: x, y: y, z: z - 1 },
      third: { x: x - 1, y: y, z: z - 1 },
      fourth: { x: x - 1, y: y, z: z },
    };
  }

  private calculateFaces(x: number, y: number, z: number) {
    /**
     * Faces of a cube 
     * 1,1,1,   0,1,1,    0,0,1,    1,0,1,      // face #1
       1,1,1,   1,0,1,    1,0,0,    1,1,0,      // face #2
       1,1,1,   1,1,0,    0,1,0,    0,1,1,       // face #3
       0,0,0,   0,1,0,    1,1,0,    1,0,0,     // face #4
       0,0,0,   0,0,1,    0,1,1,    0,1,0,      // face #5
       0,0,0,   1,0,0,    1,0,1,    0,0,1      // face #6
     */
    const faces: Face[] = [];
    const first = this.firstFace(x, y, z);
    const second = this.secondFace(x, y, z);
    return [];
  }
}

export class Grid {
  boulders: Cube[];
  map: any[][][];
}
