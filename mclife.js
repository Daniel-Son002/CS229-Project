const h = window.innerHeight;
const w = h;
let n = 11;
const side = w/n;
const menuWidth = 200;
let cells = {};
let grid = {};
const collisions = [];
let numCells = 100;
let currId = 0;
const ADHESION = 0;
const VISION = 1;
const STRENGTH = 2;
const ENERGY_EFF = 3;
const numSkills = 4;
const startingEnergy = 100;
const minEnergyDecrement = 0.3;
const maxEnergyDecrement = 2;
const simulationSpeed = 1;
let going = false;

function setup() {
  createCanvas(w+2*menuWidth,h).parent("canvas-div");
  // testResolveCollision();
  createCells();
}

const createCells = (testing=false) => {
  for (; currId < numCells; currId++) {
    let x = Math.floor(Math.random()*n);
    let y = Math.floor(Math.random()*n);
    let coord = x+","+y;
    while (!!grid[coord]) {
      x = Math.floor(Math.random()*n);
      y = Math.floor(Math.random()*n);
      coord = x+","+y;
    }
    grid[coord] = true;
    const skills = testing ? [0,0,currId/10,1-currId/10] :
      Array.from({length: numSkills}, () => Math.random());
    cells[currId] = new Cell(currId,x,y,skills);
  }
}

const resolveCollisionOldVersion = colliders => {
  const l = colliders.length;
  let maxStrength = colliders[0].skills[STRENGTH];
  let currWinner = colliders[0].id;
  for (let i = 1; i < l; i++) {
    if (colliders[i].skills[STRENGTH] > maxStrength) {
      delete cells[currWinner];
      currWinner = colliders[i].id;
    } else {
      delete cells[colliders[i].id];
    }
  }
  return currWinner;
}

const sampleFromDistribution = distr => {
  const total = distr.reduce((a,b) => a+b,0);
  const rand = Math.random()*total;
  let i = 0;
  let acc = distr[i];
  while (acc < rand) {
    i += 1;
    acc += distr[i];
  }
  return i;
}

const resolveCollision = colliders => {
  const strengths = colliders.map(c => c.skills[STRENGTH]);
  const winner = sampleFromDistribution(strengths);
  const l = colliders.length;
  let energyTaken = 0;
  for (let i = 0; i < l; i++) {
    if (i == winner) continue;
    energyTaken += colliders[i].energy;
    delete cells[colliders[i].id];
  }
  return {
    winner: colliders[winner].id,
    energy: energyTaken,
  };
}

const updateCells = () => {
  for (let cellId of Object.keys(cells)) {
    if (!cells[cellId].useEnergy()) {
      delete cells[cellId];
    }
  }
  grid = {};
  collisions.length = 0;
  for (let cellId of Object.keys(cells)) {
    cells[cellId].move();
  }
  for (let coord of collisions) {
    const {winner,energy} = resolveCollision(grid[coord]);
    cells[winner].energy += energy;
    grid[coord] = [cells[winner]];
  }
  // console.log(grid);
}

function keyPressed() {
  // console.log(cells);
  // updateCells();
  going = !going;
}

function draw() {
  translate(menuWidth,0);
  fill(255);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rect(i*side,j*side,side,side);
    }
  }
  for (let cellId of Object.keys(cells)) {
    cells[cellId].show();
  }
  if (going && frameCount % simulationSpeed == 0) {
    updateCells();
  }
}
