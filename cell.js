const visionCellOrder = [
  [1, [[-1, 0], [0, -1], [0, 1], [1, 0]]],
  [2, [[-1, -1], [-1, 1], [1, -1], [1, 1]]],
  [4, [[-2, 0], [0, -2], [0, 2], [2, 0]]],
  [5, [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]],
  [8, [[-2, -2], [-2, 2], [2, -2], [2, 2]]],
  [9, [[-3, 0], [0, -3], [0, 3], [3, 0]]],
  [10, [[-3, -1], [-3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3], [3, -1], [3, 1]]],
  [13, [[-3, -2], [-3, 2], [-2, -3], [-2, 3], [2, -3], [2, 3], [3, -2], [3, 2]]],
  [16, [[-4, 0], [0, -4], [0, 4], [4, 0]]],
  [17, [[-4, -1], [-4, 1], [-1, -4], [-1, 4], [1, -4], [1, 4], [4, -1], [4, 1]]],
  [18, [[-3, -3], [-3, 3], [3, -3], [3, 3]]],
  [20, [[-4, -2], [-4, 2], [-2, -4], [-2, 4], [2, -4], [2, 4], [4, -2], [4, 2]]],
  [25, [[-5, 0], [-4, -3], [-4, 3], [-3, -4], [-3, 4], [0, -5], [0, 5], [3, -4], [3, 4], [4, -3], [4, 3], [5, 0]]],
  [26, [[-5, -1], [-5, 1], [-1, -5], [-1, 5], [1, -5], [1, 5], [5, -1], [5, 1]]],
  [29, [[-5, -2], [-5, 2], [-2, -5], [-2, 5], [2, -5], [2, 5], [5, -2], [5, 2]]],
  [32, [[-4, -4], [-4, 4], [4, -4], [4, 4]]],
  [34, [[-5, -3], [-5, 3], [-3, -5], [-3, 5], [3, -5], [3, 5], [5, -3], [5, 3]]],
  [36, [[-6, 0], [0, -6], [0, 6], [6, 0]]],
  [37, [[-6, -1], [-6, 1], [-1, -6], [-1, 6], [1, -6], [1, 6], [6, -1], [6, 1]]],
  [40, [[-6, -2], [-6, 2], [-2, -6], [-2, 6], [2, -6], [2, 6], [6, -2], [6, 2]]],
  [41, [[-5, -4], [-5, 4], [-4, -5], [-4, 5], [4, -5], [4, 5], [5, -4], [5, 4]]],
  [45, [[-6, -3], [-6, 3], [-3, -6], [-3, 6], [3, -6], [3, 6], [6, -3], [6, 3]]],
  [49, [[-7, 0], [0, -7], [0, 7], [7, 0]]],
  [50, [[-7, -1], [-7, 1], [-5, -5], [-5, 5], [-1, -7], [-1, 7], [1, -7], [1, 7], [5, -5], [5, 5], [7, -1], [7, 1]]],
  [52, [[-6, -4], [-6, 4], [-4, -6], [-4, 6], [4, -6], [4, 6], [6, -4], [6, 4]]],
  [53, [[-7, -2], [-7, 2], [-2, -7], [-2, 7], [2, -7], [2, 7], [7, -2], [7, 2]]],
  [58, [[-7, -3], [-7, 3], [-3, -7], [-3, 7], [3, -7], [3, 7], [7, -3], [7, 3]]],
  [61, [[-6, -5], [-6, 5], [-5, -6], [-5, 6], [5, -6], [5, 6], [6, -5], [6, 5]]],
  [64, [[-8, 0], [0, -8], [0, 8], [8, 0]]],
  [65, [[-8, -1], [-8, 1], [-7, -4], [-7, 4], [-4, -7], [-4, 7], [-1, -8], [-1, 8], [1, -8], [1, 8], [4, -7], [4, 7], [7, -4], [7, 4], [8, -1], [8, 1]]],
  [68, [[-8, -2], [-8, 2], [-2, -8], [-2, 8], [2, -8], [2, 8], [8, -2], [8, 2]]],
  [72, [[-6, -6], [-6, 6], [6, -6], [6, 6]]],
  [73, [[-8, -3], [-8, 3], [-3, -8], [-3, 8], [3, -8], [3, 8], [8, -3], [8, 3]]],
  [74, [[-7, -5], [-7, 5], [-5, -7], [-5, 7], [5, -7], [5, 7], [7, -5], [7, 5]]],
  [80, [[-8, -4], [-8, 4], [-4, -8], [-4, 8], [4, -8], [4, 8], [8, -4], [8, 4]]],
  [81, [[-9, 0], [0, -9], [0, 9], [9, 0]]],
  [82, [[-9, -1], [-9, 1], [-1, -9], [-1, 9], [1, -9], [1, 9], [9, -1], [9, 1]]],
  [85, [[-9, -2], [-9, 2], [-7, -6], [-7, 6], [-6, -7], [-6, 7], [-2, -9], [-2, 9], [2, -9], [2, 9], [6, -7], [6, 7], [7, -6], [7, 6], [9, -2], [9, 2]]],
  [89, [[-8, -5], [-8, 5], [-5, -8], [-5, 8], [5, -8], [5, 8], [8, -5], [8, 5]]],
  [90, [[-9, -3], [-9, 3], [-3, -9], [-3, 9], [3, -9], [3, 9], [9, -3], [9, 3]]],
  [97, [[-9, -4], [-9, 4], [-4, -9], [-4, 9], [4, -9], [4, 9], [9, -4], [9, 4]]],
  [98, [[-7, -7], [-7, 7], [7, -7], [7, 7]]],
  [100, [[-10, 0], [-8, -6], [-8, 6], [-6, -8], [-6, 8], [0, -10], [0, 10], [6, -8], [6, 8], [8, -6], [8, 6], [10, 0]]],
];

class Cell {

  constructor(id, x, y, skills, birthTime) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.energy = startingEnergy;
    this.randDir = Math.random()*TWO_PI;
    const total = skills.reduce((a,b) => a+b,0);
    this.skills = skills.map(x => x/total);
    const visionDistSq = (maxVision*this.skills[VISION])**2;
    this.visionOrder = [];
    for (let i = 0; i < 43; i++) {
      const [d2,lst] = visionCellOrder[i];
      if (d2 > visionDistSq) break;
      const shuffledLst = lst.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      this.visionOrder = this.visionOrder.concat(shuffledLst);
    }
    this.energyDecr = lerp(minEnergyDecrement,maxEnergyDecrement,1-this.skills[ENERGY_EFF]);
    this.neighborRight = -1;
    this.neighborDown = -1;
    this.totalSize = 0;
    this.age = 0;
    this.numReproduce = 0;
    this.birthTime = birthTime;
  }

  useEnergy() {
    this.energy -= this.energyDecr;
    return this.energy > 0;
  }

  getClosestPlant() {
    for (const [movex,movey] of this.visionOrder) {
      const coord = (this.x+movex)+","+(this.y+movey);
      if (!!plants[coord]) return [movex**2+movey**2,[movex,movey]];
    }
    return [maxVision+1,undefined];
  }

  doMove(x,y) {
    this.x += x;
    this.y += y;
    // this.x = constrain(this.x,0,n-1);
    // this.y = constrain(this.y,0,n-1);
    const coord = this.x+","+this.y;
    if (!grid[coord]) {
      grid[coord] = [];
    } else if (grid[coord].length == 1) {
      collisions.push(coord);
      // console.log(coord,grid[coord],collisions);
    }
    // console.log(this.id,coord)
    grid[coord].push(this);
  }

  show() {
    push();
    noStroke();
    // fill(200*(1-this.skills[STRENGTH]));
    fill(lerp(60,255,this.skills[STRENGTH]),
         lerp(60,255,this.skills[VISION]),
         lerp(60,255,this.skills[ENERGY_EFF]),
         lerp(150,255,this.skills[ADHESION]));
    rect(this.x*side,this.y*side,side,side);
    pop();
    if (showIds) {
      fill(0,0,0);
      text(this.id,this.x*side+side/3,this.y*side+side/3);
      text(orgAsgns[this.id],this.x*side+side/3,this.y*side+2*side/3);
    }
  }

  showConns() {
    push();
    strokeWeight(2);
    stroke(0);
    if (this.neighborRight != -1) {
      line((this.x+0.9)*side,(this.y+0.5)*side,(this.x+1.1)*side,(this.y+0.5)*side);
    }
    if (this.neighborDown != -1) {
      line((this.x+0.5)*side,(this.y+0.9)*side,(this.x+0.5)*side,(this.y+1.1)*side);
    }
    pop();
  }
}
