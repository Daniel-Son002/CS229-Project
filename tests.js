const testSampleFromDistribution = () => {
  const d = [0.11,0.22,0.33,0.44,0.55];
  const counters = [0,0,0,0,0];
  for (let i = 0; i < 16500000; i++) {
    counters[sampleFromDistribution(d)] += 1;
  }
  console.log(counters);
  noLoop();
}

const testResolveCollision = () => {
  n = 3;
  numCells = 9;
  const simul = [0,0,0,0,0,0,0,0,0];
  for (let i = 0; i < 45000; i++) {
    cells = {};
    grid = {};
    currId = 0;
    createCells(true);
    while (Object.keys(cells).length > 1) {
      updateCells();
    }
    simul[Object.keys(cells)[0]] += 1;
  }
  console.log(simul);
  noLoop();
}
