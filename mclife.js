const h = window.innerHeight;
const w = h;
let n = 100;
const side = w/n;
const menuWidth = 200;
let cells = {};
let grid = {};
const collisions = [];
// const pairs = [];
const orgList = {};
const orgAsgns = {};
let numCells = 1000;
let currId = 0;
let currOrgId = numCells;
const ADHESION = 0;
const VISION = 1;
const STRENGTH = 2;
const ENERGY_EFF = 3;
const numSkills = 4;
const startingEnergy = 100;
const minEnergyDecrement = -0.5;
const maxEnergyDecrement = 2;
const visionCellLimit = 5;
const simulationSpeed = 1;
let going = false;

function setup() {
  createCanvas(w+2*menuWidth,h).parent("canvas-div");
  // testResolveCollision();
  createCells();
  // while (Object.keys(orgList).length >= 10) {
  //   updateCells();
  //   // console.log(Object.keys(orgList).length);
  // }
  // draw();
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
    const cell = new Cell(currId,x,y,skills);
    cells[currId] = cell;
    orgList[currId] = [cell];
    orgAsgns[currId] = currId;
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
  // for (let cellId of Object.keys(cells)) {
  //   if (!cells[cellId].useEnergy()) {
  //     delete cells[cellId];
  //   }
  // }
  grid = {};
  for (let cellId of Object.keys(cells)) {
    const cell = cells[cellId];
    const coord = cell.x+","+cell.y;
    if (!!grid[coord]) console.error("unresolved collision before movement");
    grid[coord] = cell;
  }

  const pairs = [[], []];
  for (let cellId of Object.keys(cells)) {
    const cell = cells[cellId];
    const neighbors = [(cell.x+1)+","+cell.y, cell.x+","+(cell.y+1)];
    for (let i = 0; i < 2; i++) {
      const neighbor = neighbors[i];
      const cell2 = grid[neighbor];
      if (!!cell2) {
        const adhesion = Math.max(cell.skills[ADHESION], cell2.skills[ADHESION]);
        if (Math.random() < adhesion) pairs[i].push([cell,cell2]);
      }
    }
  }
  
  const neighborStrings = ["Right","Down"];
  for (let i = 0; i < 2; i++) {
    for (const pair of pairs[i]) {
      if (pair[0]["neighbor"+neighborStrings[i]]) continue;
      pair[0]["neighbor"+neighborStrings[i]] = true;
      const org1 = orgAsgns[pair[0].id];
      const org2 = orgAsgns[pair[1].id];
      // if (!orgList[org1] || !orgList[org2]) {
      //   console.log("BADD",org1,org2);
      // }
      if (org1 != org2) {
        orgList[org1] = orgList[org1].concat(orgList[org2]);
        for (let {id} of orgList[org2]) {
          orgAsgns[id] = org1;
        }
        delete orgList[org2];
        // orgAsgns[pair[1].id] = org1;
      }
    }
  }

  grid = {};
  for (const orgId of Object.keys(orgList)) {
    const orgCells = orgList[orgId].slice();
    const dirs = [[0,0]];
    let left = true;
    for ({x} of orgCells) {
      if (x == 0) {
        left = false;
        break;
      }
    }
    if (left) dirs.push([-1,0]);
    let right = true;
    for ({x} of orgCells) {
      if (x == n-1) {
        right = false;
        break;
      }
    }
    if (right) dirs.push([1,0]);
    let top = true;
    for ({y} of orgCells) {
      if (y == 0) {
        top = false;
        break;
      }
    }
    if (top) dirs.push([0,-1]);
    let bottom = true;
    for ({y} of orgCells) {
      if (y == n-1) {
        bottom = false;
        break;
      }
    }
    if (bottom) dirs.push([0,1]);
    if (orgCells.length > visionCellLimit) {
      orgCells.sort((a,b) => b.skills[VISION]-a.skills[VISION]);
      orgCells.splice(visionCellLimit);
    }
    const moves = orgCells.map(c => c.getMove(dirs));
    const cellVisions = orgCells.map(c => c.skills[VISION]);
    const move = moves[sampleFromDistribution(cellVisions)];
    for (let cell of orgList[orgId]) {
      // console.log(cell.id,...move);
      cell.doMove(...move);
    }
  }

  // collisions.length = 0;
  // for (let cellId of Object.keys(cells)) {
  //   cells[cellId].move();
  // }
  // for (let coord of collisions) {
  //   const {winner,energy} = resolveCollision(grid[coord]);
  //   cells[winner].energy += energy;
  //   grid[coord] = [cells[winner]];
  // }
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
  for (let cellId of Object.keys(cells)) {
    cells[cellId].showConns();
  }
  if (going && frameCount % simulationSpeed == 0) {
    updateCells();
  }
  // noLoop();
}
