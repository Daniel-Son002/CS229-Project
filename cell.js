class Cell {

  constructor(id, x, y, skills) {
    this.id = id;
    this.orgId = id;
    this.x = x;
    this.y = y;
    this.energy = startingEnergy;
    const total = skills.reduce((a,b) => a+b,0);
    this.skills = skills.map(x => x/total);
    this.neighborRight = false;
    this.neighborDown = false;
  }

  useEnergy() {
    this.energy -= lerp(minEnergyDecrement,maxEnergyDecrement,1-this.skills[ENERGY_EFF]);
    return this.energy > 0;
  }

  getMove(dirs) {
    const dir = Math.floor(Math.random()*dirs.length);
    return dirs[dir];
    // if (dir != 4) {
    //   fill(255);
    //   rect(this.x*side,this.y*side,side,side);
    // }
  }

  doMove(x,y) {
    this.x += x;
    this.y += y;
    // this.x = constrain(this.x,0,n-1);
    // this.y = constrain(this.y,0,n-1);
    const coord = this.x+","+this.y;
    if (!grid[coord]) {
      grid[coord] = [];
    } else {
      collisions.push(coord);
    }
    // console.log(this.id,coord)
    grid[coord].push(this);
  }

  show() {
    fill(200*(1-this.skills[STRENGTH]));
    rect(this.x*side,this.y*side,side,side);
    fill(0,0,0);
    text(this.id,this.x*side+side/3,this.y*side+side/3);
  }

  showConns() {
    push();
    strokeWeight(3);
    if (this.neighborRight) {
      line((this.x+0.95)*side,(this.y+0.5)*side,(this.x+1.05)*side,(this.y+0.5)*side);
    }
    if (this.neighborDown) {
      line((this.x+0.5)*side,(this.y+0.95)*side,(this.x+0.5)*side,(this.y+1.05)*side);
    }
    pop();
  }
}
