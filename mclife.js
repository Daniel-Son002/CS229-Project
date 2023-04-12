const h = window.innerHeight;
const w = h;
const n = 11;
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
const speed = 1;
let going = false;

function setup() {
  createCanvas(w+2*menuWidth,h).parent("canvas-div");
  createCells();
}

const createCells = () => {
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
    const skills = Array.from({length: numSkills}, () => Math.random());
    cells[currId] = new Cell(currId,x,y,skills);
  }
}

const updateCells = () => {
  grid = {};
  collisions.length = 0;
  for (let cellId of Object.keys(cells)) {
    cells[cellId].move();
  }
  for (let coord of collisions) {
    const colliders = grid[coord];
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
    grid[coord] = [cells[currWinner]];
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
  if (going && frameCount % speed == 0) {
    updateCells();
  }
}
