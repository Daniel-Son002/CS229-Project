const logging = {
  movement: false,
  collisions1: false,
  eatPlant1: false,
  energyDeath: false,
  connection: false,
  reproduction: true,
  eatPlant2: true,
  collisions2: true,
  createPlant: false,
};
const showIds = false;
const showConnections = false;
const h = window.innerHeight;
const w = h;
let n = 50;
const side = w/n;
const menuWidth = 0;
let cells = {};
let grid = {};
const collisions = [];
// const pairs = [];
let orgList = {};
let orgAsgns = {};
const plants = {};
const plantEnergy = 250;
const startingNumPlants = Math.floor(400/150**2*n**2);
const newPlantRate = 6*n/150;
const maxPlants = Math.floor(800/150**2*n**2);
let numCells = Math.floor(1000/150**2*n**2);
let currId = 1;
let currOrgId = numCells;
const ADHESION = 0;
const VISION = 1;
const STRENGTH = 2;
const ENERGY_EFF = 3;
const numSkills = 4;
const startingEnergy = 1000;
const minEnergyDecrement = -1;
const maxEnergyDecrement = 2;
const maxVision = 10;
const fixedReprThresh = 5*startingEnergy;
const perCellReprThresh = 2*startingEnergy;
// const visionCellLimit = 5;
const simulationSpeed = 1;
const moveCoords = {
  "none": [0,0], 
  "right": [1,0],
  "left": [-1,0],
  "down": [0,1],
  "up": [0,-1],
}
let going = false;

function setup() {
  createCanvas(w+2*menuWidth,h).parent("canvas-div");
  // testResolveCollision();
  createCells();
  createPlants();
  // while (Object.keys(orgList).length >= 10) {
  //   updateCells();
  //   // console.log(Object.keys(orgList).length);
  // }
  // draw();
}

const createCells = (testing=false) => {
  for (; currId <= numCells; currId++) {
    let x = Math.floor(Math.random()*n);
    let y = Math.floor(Math.random()*n);
    let coord = x+","+y;
    while (!!grid[coord]) {
      x = Math.floor(Math.random()*n);
      y = Math.floor(Math.random()*n);
      coord = x+","+y;
    }
    grid[coord] = true;
    let skills = testing ? [0,0,currId/10,1-currId/10] :
      Array.from({length: numSkills}, () => Math.random());
    const cell = new Cell(currId,x,y,skills);
    cells[currId] = cell;
    orgList[currId] = [cell];
    orgAsgns[currId] = currId;
  }
}

const createPlant = () => {
  let x = Math.floor(Math.random()*n);
  let y = Math.floor(Math.random()*n);
  let coord = x+","+y;
  while (!!grid[coord] || !!plants[coord]) {
    x = Math.floor(Math.random()*n);
    y = Math.floor(Math.random()*n);
    coord = x+","+y;
  }
  plants[coord] = true;
}

const createPlants = () => {
  for (let i = 0; i < startingNumPlants; i++) {
    createPlant();
  }
}

const showPlant = coord => {
  const [x,y] = coord.split(",").map(i=>parseInt(i));
  push();
  noStroke();
  // fill(200*(1-this.skills[STRENGTH]));
  fill(53,156,80);
  circle((x+0.5)*side,(y+0.5)*side,side);
  pop();
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
  return min(i,distr.length-1);
}

const resolveCollision = colliders => {
  const strengths = colliders.map(c => c.skills[STRENGTH]);
  const winner = sampleFromDistribution(strengths);
  // console.log(winner);
  const winnerId = colliders[winner].id;
  const l = colliders.length;
  const cell = colliders[0];
  const coordLeft = (cell.x-1)+","+cell.y;
  if (!!grid[coordLeft]) {
    for (let cell2 of grid[coordLeft]) {
      if (cell2.neighborRight != winnerId) {
        cell2.neighborRight = -1;
      }
    }
  }
  const coordUp = cell.x+","+(cell.y-1);
  if (!!grid[coordUp]) {
    for (let cell2 of grid[coordUp]) {
      if (cell2.neighborDown != winnerId) {
        cell2.neighborDown = -1;
      }
    }
  }
  let energyTaken = 0;
  const losers = [];
  for (let i = 0; i < l; i++) {
    if (i == winner) continue;
    losers.push(colliders[i].id);
    // console.log(colliders[i].id)
    energyTaken += colliders[i].energy;
    delete cells[colliders[i].id];
  }
  return {
    winner: winnerId,
    energy: energyTaken,
    losers,
  };
}

const updateCells = () => {
  // move organisms
  grid = {};
  collisions.length = 0;
  for (const orgId of Object.keys(orgList)) {
    const orgCells = orgList[orgId].slice();
    const dirs = {};
    let left = true;
    for ({x} of orgCells) {
      if (x == 0) {
        left = false;
        break;
      }
    }
    if (left) dirs.left = true;
    let right = true;
    for ({x} of orgCells) {
      if (x == n-1) {
        right = false;
        break;
      }
    }
    if (right) dirs.right = true;
    let top = true;
    for ({y} of orgCells) {
      if (y == 0) {
        top = false;
        break;
      }
    }
    if (top) dirs.up = true;
    let bottom = true;
    for ({y} of orgCells) {
      if (y == n-1) {
        bottom = false;
        break;
      }
    }
    if (bottom) dirs.down = true;
    // if (orgCells.length > visionCellLimit) {
    orgCells.sort((a,b) => b.skills[VISION]-a.skills[VISION]);
    //   orgCells.splice(visionCellLimit);
    // }
    let closestPlant = maxVision+1;
    let closestDir = undefined;
    for (let cell of orgCells) {
      const [plantDist,plantDir] = cell.getClosestPlant();
      if (plantDist >= closestPlant) continue;
      const [x,y] = plantDir;
      if ((x<0 && !!dirs.left) || (x>0 && !!dirs.right) || (y<0 && !!dirs.up) || (y>0 && !!dirs.down)) {
        closestPlant = plantDist;
        closestDir = plantDir;
      }
    }
    let move = undefined;
    if (!closestDir || Math.random() < 0.05) {
      while (true) {
        const dirLst = ["left","right","up","down"];
        // const dir = Math.floor(Math.random()*dirLst.length);
        const randDir = orgCells[0].randDir;
        const poss = []
        const cosine = Math.cos(randDir);
        poss.push(cosine>0 ? "right" : "left");
        const sine = Math.sin(randDir);
        poss.push(sine>0 ? "down" : "up");
        const idx = Math.random()*(abs(cosine)+abs(sine)) < abs(cosine) ? 0 : 1;
        move = poss[idx];
        if (!!dirs[move]) break;
        const newDir = Math.random()*TWO_PI;
        for (let cell of orgCells) {
          cell.randDir = newDir;
        }
      }
    } else {
      const poss = [];
      const [movex,movey] = closestDir;
      if (movex < 0 && !!dirs.left) poss.push("left");
      if (movex > 0 && !!dirs.right) poss.push("right");
      if (movey < 0 && !!dirs.up) poss.push("up");
      if (movey > 0 && !!dirs.down) poss.push("down");
      if (poss.length == 1) {
        move = poss[0];
      } else {
        const idx = Math.random()*(abs(movex)+abs(movey)) < abs(movex) ? 0 : 1;
        move = poss[idx];
      }
    }
    // const moves = orgCells.map(c => c.getMove(dirs));
    // console.log(moves,orgCells.map(c=>c.id));
    // const cellVisions = orgCells.map(c => c.skills[VISION]);
    // const move = moves[sampleFromDistribution(cellVisions)];
    if (logging.movement) console.log("Org",orgId,"moved",move);
    for (let cell of orgList[orgId]) {
      // console.log(cell.id,...move);
      cell.doMove(...moveCoords[move]);
    }
  }

  // resolve collisions
  for (let coord of collisions) {
    // console.log(grid[coord])
    const {winner,energy,losers} = resolveCollision(grid[coord]);
    if (logging.collisions1) console.log(winner,"ate",losers);
    // console.log(winner,energy);
    cells[winner].energy += cells[winner].skills[ENERGY_EFF]*energy;
    grid[coord] = [cells[winner]];
  }

  // initialize grid with single cells
  grid = {};
  for (let cellId of Object.keys(cells)) {
    const cell = cells[cellId];
    const coord = cell.x+","+cell.y;
    if (!!grid[coord]) console.error("unresolved collision after movement");
    grid[coord] = cell;
  }

  // gain plant energy
  for (let plantCoord of Object.keys(plants)) {
    if (!!grid[plantCoord]) {
      delete plants[plantCoord];
      grid[plantCoord].energy += plantEnergy;
      const cellId = grid[plantCoord].id;
      if (logging.eatPlant1) console.log(cellId,'ate plant');
      const orgId = orgAsgns[cellId];
      const newDir = Math.random()*TWO_PI;
      for (let cell of orgList[orgId]) {
        cell.randDir = newDir;
      }
    }
  }

  // use energy
  for (let cellId of Object.keys(cells)) {
    const cell = cells[cellId];
    if (!cell.useEnergy()) {
      if (logging.energyDeath) console.log(cell.id,"died");
      const coord = cell.x+","+cell.y;
      const coordLeft = (cell.x-1)+","+cell.y;
      const coordUp = cell.x+","+(cell.y-1);
      if (!!grid[coordLeft]) grid[coordLeft].neighborRight = -1;
      if (!!grid[coordUp]) grid[coordUp].neighborDown = -1;
      delete cells[cellId];
      delete grid[coord];
    }
  }

  // adhere
  for (let cellId of Object.keys(cells)) {
    const cell = cells[cellId];
    // const org = orgAsgns[cell.id];
    if (cell.neighborRight == -1) {
      const coordRight = (cell.x+1)+","+cell.y;
      const cellRight = grid[coordRight];
      if (!!cellRight/* && org != orgAsgns[cellRight.id]*/) {
        // const adhesion1 = cell.skills[ADHESION];
        // const adhesion2 = cellRight.skills[ADHESION];
        // if (Math.random() < adhesion1 || Math.random() < adhesion2) {
        const adhesion = Math.min(cell.skills[ADHESION], cellRight.skills[ADHESION]);
        if (Math.random() < adhesion) {
          cell.neighborRight = cellRight.id;
          if (logging.connection) console.log(cell.id,"connect",cellRight.id,"right");
        }
      }
    }
    if (cell.neighborDown == -1) {
      const coordDown = cell.x+","+(cell.y+1);
      const cellDown = grid[coordDown];
      if (!!cellDown/* && org != orgAsgns[cellDown.id]*/) {
        // const adhesion1 = cell.skills[ADHESION];
        // const adhesion2 = cellDown.skills[ADHESION];
        // if (Math.random() < adhesion1 || Math.random() < adhesion2) {
        const adhesion = Math.min(cell.skills[ADHESION], cellDown.skills[ADHESION]);
        if (Math.random() < adhesion) {
          cell.neighborDown = cellDown.id;
          if (logging.connection) console.log(cell.id,"connect",cellDown.id,"down");
        }
      }
    }
  }
  
  // make graph
  const adjList = {};
  for (let i of Object.keys(cells)) {
    adjList[i] = [];
  }
  for (let i of Object.keys(cells)) {
    const cell = cells[i];
    if (cell.neighborRight != -1) {
      adjList[i].push(cell.neighborRight);
      adjList[cell.neighborRight].push(i);
    }
    if (cell.neighborDown != -1) {
      adjList[i].push(cell.neighborDown);
      adjList[cell.neighborDown].push(i);
    }
  }

  // assign organism ids
  orgAsgns = {};
  orgList = {};
  let currOrgId = 1;
  for (let i of Object.keys(cells)) {
    if (!!orgAsgns[i]) continue;
    const queue = [i];
    const currOrg = [];
    while (queue.length > 0) {
      const currId = queue.pop();
      if (!!orgAsgns[currId]) continue;
      orgAsgns[currId] = currOrgId;
      currOrg.push(cells[currId]);
      for (let neighbor of adjList[currId]) {
        if (!orgAsgns[neighbor]) queue.push(neighbor);
      }
    }
    orgList[currOrgId] = currOrg;
    currOrgId++;
  }

  // redistribute energy, assign randDir, and mark for reproduction
  const reproduction = []
  for (let orgId of Object.keys(orgList)) {
    const org = orgList[orgId];
    const totalEnergy = org.reduce((a,b)=>a+b.energy,0);
    const totalDir = org.reduce((a,b)=>a+b.randDir,0);
    const size = org.length;
    let energyPer = totalEnergy/size;
    if (totalEnergy > fixedReprThresh+perCellReprThresh*size) {
      energyPer -= fixedReprThresh/size;
      energyPer /= 2;
      reproduction.push(orgId);
    }
    for (let cell of org) {
      cell.energy = energyPer;
      cell.randDir = totalDir/size;
    }
  }

  // initialize grid as arrays again
  grid = {};
  for (let cellId of Object.keys(cells)) {
    const cell = cells[cellId];
    const coord = cell.x+","+cell.y;
    if (!!grid[coord]) console.error("unresolved collision before reproduction");
    grid[coord] = [cell];
  }

  // reproduce
  collisions.length = 0;
  for (let orgId of reproduction) {
    let boundedBox = [n,-1,n,-1];
    const orgCells = orgList[orgId];
    if (logging.reproduction) console.log(orgId,"reproducing to",currOrgId,"size:",orgCells.length);
    // if (orgCells.length > 3) going = false;
    for (let cell of orgCells) {
      boundedBox[0] = min(boundedBox[0],cell.x);
      boundedBox[1] = max(boundedBox[1],cell.x);
      boundedBox[2] = min(boundedBox[2],cell.y);
      boundedBox[3] = max(boundedBox[3],cell.y);
    }
    let offsetx;
    let offsety;
    let minCollisions = n**2;
    let minoffsetx = 0;
    let minoffsety = 0;
    for (let i = 0; i < 10; i++) {
      offsetx = Math.floor(Math.random()*(n-(boundedBox[1]-boundedBox[0])));
      offsety = Math.floor(Math.random()*(n-(boundedBox[3]-boundedBox[2])));
      let numCollisions = 0;
      for (let cell of orgCells) {
        const [newx,newy] = [offsetx+cell.x-boundedBox[0],offsety+cell.y-boundedBox[2]];
        const coord = newx+","+newy;
        if (!!grid[coord]) numCollisions++;
      }
      if (numCollisions < minCollisions) {
        minCollisions = numCollisions;
        minoffsetx = offsetx;
        minoffsety = offsety;
      }
      if (numCollisions == 0) break;
    }
    orgList[currOrgId] = [];
    const newStartingEnergy = orgCells[0].energy;
    const newDir = Math.random()*TWO_PI;
    const findNeighborIdx = id => {
      for (let i = 0; i < orgCells.length; i++) {
        if (orgCells[i].id == id) return i;
      }
    }
    for (let i = 0; i < orgCells.length; i++) {
      const cell = orgCells[i];
      const [newx,newy] = [minoffsetx+cell.x-boundedBox[0],minoffsety+cell.y-boundedBox[2]];
      const skills = cell.skills.map(e => constrain(e+Math.random()*0.2-0.1,0,1));
      const newCell = new Cell(currId,newx,newy,skills);
      newCell.energy = newStartingEnergy;
      newCell.randDir = newDir;
      if (cell.neighborRight != -1) {
        newCell.neighborRight = currId+findNeighborIdx(cell.neighborRight)-i;
      } else {
        newCell.neighborRight = -1;
      }
      if (cell.neighborDown != -1) {
        newCell.neighborDown = currId+findNeighborIdx(cell.neighborDown)-i;
      } else {
        newCell.neighborDown = -1;
      }
      cells[currId] = newCell;
      orgList[currOrgId].push(newCell);
      orgAsgns[currId] = currOrgId;
      const coord = newx+","+newy;
      if (!grid[coord]) {
        grid[coord] = [];
      } else if (grid[coord].length == 1) {
        collisions.push(coord);
      }
      grid[coord].push(newCell);
      if (!!plants[coord]) {
        delete plants[coord];
        newCell.energy += plantEnergy;
        if (logging.eatPlant2) console.log(currId,'ate plant at birth');
      }
      currId++;
    }
    currOrgId++;
  }

  // resolve collisions after reproduction
  for (let coord of collisions) {
    // console.log(grid[coord])
    const {winner,energy,losers} = resolveCollision(grid[coord]);
    if (logging.collisions2) console.log(winner,"ate",losers,"after repr");
    // console.log(winner,energy);
    cells[winner].energy += cells[winner].skills[ENERGY_EFF]*energy;
    grid[coord] = [cells[winner]];
  }

  // const neighborStrings = ["Right","Down"];
  // for (let i = 0; i < 2; i++) {
  //   for (const pair of pairs[i]) {
  //     if (pair[0]["neighbor"+neighborStrings[i]] != -1) continue;
  //     pair[0]["neighbor"+neighborStrings[i]] = pair[1].id;
  //     const org1 = orgAsgns[pair[0].id];
  //     const org2 = orgAsgns[pair[1].id];
  //     // if (!orgList[org1] || !orgList[org2]) {
  //     //   console.log("BADD",org1,org2);
  //     // }
  //     if (org1 != org2) {
  //       orgList[org1] = orgList[org1].concat(orgList[org2]);
  //       for (let {id} of orgList[org2]) {
  //         orgAsgns[id] = org1;
  //       }
  //       delete orgList[org2];
  //       // orgAsgns[pair[1].id] = org1;
  //     }
  //   }
  // }

  // for (let cellId of Object.keys(cells)) {
  //   cells[cellId].move();
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
  noStroke();
  rect(0,0,w,h);
  // for (let i = 0; i < n; i++) {
  //   for (let j = 0; j < n; j++) {
  //     rect(i*side,j*side,side,side);
  //   }
  // }
  for (let cellId of Object.keys(cells)) {
    cells[cellId].show();
  }
  for (let plantCoord of Object.keys(plants)) {
    showPlant(plantCoord);
  }
  if (showConnections) {
    for (let cellId of Object.keys(cells)) {
      cells[cellId].showConns();
    }
  }
  if (going && frameCount % simulationSpeed == 0) {
    updateCells();
    if (Object.keys(plants).length < maxPlants && Math.random() < newPlantRate) {
      const newPlantTrials = Math.ceil(newPlantRate*2);
      for (let i = 0; i < newPlantTrials; i++) {
        if (Math.random() < newPlantRate/newPlantTrials) {
          createPlant();
        }
      }
      if (logging.createPlant) console.log("plant created");
    }
  }
  // noLoop();
}
