class Cell {

  constructor(id, x, y, skills) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.energy = startingEnergy;
    const total = skills.reduce((a,b) => a+b,0);
    this.skills = skills.map(x => x/total);
  }

  useEnergy() {
    this.energy -= lerp(minEnergyDecrement,maxEnergyDecrement,1-this.skills[ENERGY_EFF]);
    return this.energy > 0;
  }

  move() {
    const dir = Math.floor(Math.random()*5);
    // if (dir != 4) {
    //   fill(255);
    //   rect(this.x*side,this.y*side,side,side);
    // }
    switch (dir) {
      case 0:
        this.x += 1;
        break;
      case 1:
        this.x -= 1;
        break;
      case 2:
        this.y += 1;
        break;
      case 3:
        this.y -= 1;
    }
    this.x = constrain(this.x,0,n-1);
    this.y = constrain(this.y,0,n-1);
    const coord = this.x+","+this.y;
    if (!grid[coord]) {
      grid[coord] = [];
    } else {
      collisions.push(coord);
    }
    grid[coord].push(this);
  }

  show() {
    fill(200*(1-this.skills[STRENGTH]));
    rect(this.x*side,this.y*side,side,side);
    fill(0,0,0);
    text(this.id,this.x*side+side/3,this.y*side+side/3);
  }
}
