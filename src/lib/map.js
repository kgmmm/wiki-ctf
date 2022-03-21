let mapData = [];

export function makeMapData(gameState, myID) {
  if(gameState.stage === "planting") {
    mapData = clearMapData();

    return mapData;
  }
  if(gameState.stage !== "playing") return;

  let me = gameState["players"].find(player => player.id === myID);
  let opponent = gameState["players"].find(player => player.id !== myID);

  let carryingValue;

  if(me.carrying && opponent.carrying) {
    carryingValue = 3;
  } else if (me.carrying) {
    carryingValue = 1;
  } else if (opponent.carrying) {
    carryingValue = 2;
  } else {
    carryingValue = 0;
  }

  mapData.push([me.location, opponent.location, carryingValue]);

  return mapData;
}

export function clearMapData() {
  mapData = [];

  return mapData;
}