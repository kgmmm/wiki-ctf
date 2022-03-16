import http from "http";
import { Server as SocketIO } from "socket.io";

const server = http.createServer();
const io = new SocketIO(server, {
  cors: {
    origin: "*",
  },
});

let _GAMEINTERVAL = 1000;
let _ROUNDTIME = 180000;
let _SCORELIMIT = 3;

export let liveGames = [];

function Player() {
  this.id = undefined;              // UID from Firebase auth
  this.planted = false;             // has player planted their flag
  this.score = 0;                   // players current score
  this.location = undefined;        // page the player is currently on
  this.base = undefined;            // page the players flag is planted on
  this.carrying = false;            // is the player carrying a flag
  this.displayName = undefined;     // displayName from Firebase auth
  this.profilePic = undefined;      // profilePic from Firebase auth
  this.roundReady = false;          // is player ready for next round
}
function Game(gameType = "private", roundTime = _ROUNDTIME, scoreLimit = _SCORELIMIT) {
  this.lobbyCode = undefined;       // lobbyCode used for the game
  this.stage = "waiting";           // current stage the game is at, 'waiting' : 'planting' : 'playing' : 'roundend' : 'gameend'
  this.roundTime = roundTime;       // time (ms) per round
  this.scoreLimit = scoreLimit;     // score limit of the game
  this.players = [];                // array of player objects
  this.players[0] = new Player();
  this.lastRoundResult = undefined; // result of the last round, 'time' : id of player who won the round
  this.gameType = gameType;         // public (join via quickplay), private/null (join via code), custom (private game with custom gameVARS)
}
let socketMap = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected.`);

  socket.on("fetchedPage", (userID, data) => {
    console.log(`${userID} fetched page: '${data.pageid}' with title '${data.title}' on socket ${socket.id}`); // LOG
    let lobbyCode = socketMap.get(socket.id);
    let targetPlayer = liveGames[lobbyCode]["players"].find(player => player.id === userID);
    targetPlayer.location = data.title;
    io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
  });

  socket.on("plantFlag", (userID, fromTimeout) => {
    let lobbyCode = socketMap.get(socket.id);
    let targetPlayer = liveGames[lobbyCode]["players"].find(player => player.id === userID);
    let opponent = liveGames[lobbyCode]["players"].find(player => player.id !== userID);

    if(fromTimeout == true) { // event came from the time running out
      if(targetPlayer.planted == false) { // if you didnt plant
        socket.emit("eject", { title: "Kicked!", message: "You have been kicked for being AFK." }); // kick you
      }
    } else if(fromTimeout == false) { // event came from the user planting
      if(targetPlayer.planted == false && targetPlayer.location !== opponent.base) { // if you havent planted yet, and you are trying a valid plant
        targetPlayer.base = targetPlayer.location; // set your base
        targetPlayer.planted = true; // you have planted
        socket.emit("planted"); // send back the plant was success
        if(opponent.planted == true) { // if your opponent has already planted when you plant
          liveGames[lobbyCode].stage = "playing";
          liveGames[lobbyCode].players[0].location = liveGames[lobbyCode].players[0].base;
          liveGames[lobbyCode].players[1].location = liveGames[lobbyCode].players[1].base;
          io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
          startGameLoop(lobbyCode, liveGames[lobbyCode]);
        }
      } else if (targetPlayer.planted == true || targetPlayer.location === opponent.base) { // if you've already planted OR your plant attempt isnt valid
        socket.emit("pop", { title: "Cannot Plant There!", message: "You can't plant your flag there." }); // pop toast
      }
    }
  });

  socket.on("roundReady", (userID) => {
    let lobbyCode = socketMap.get(socket.id);
    let targetPlayer = liveGames[lobbyCode]["players"].find(player => player.id === userID);

    targetPlayer.roundReady = true;

    if(liveGames[lobbyCode].players[0].roundReady && liveGames[lobbyCode].players[1].roundReady) { // if both players are ready for next round
      liveGames[lobbyCode].stage = "planting"; // set stage to planting
      liveGames[lobbyCode].players[0].carrying = false; // no one carrying
      liveGames[lobbyCode].players[1].carrying = false;
      liveGames[lobbyCode].players[0].planted = false; // no one planted
      liveGames[lobbyCode].players[1].planted = false;
      liveGames[lobbyCode].players[0].roundReady = false; // no one ready
      liveGames[lobbyCode].players[1].roundReady = false;
      liveGames[lobbyCode].roundTime = _ROUNDTIME; // reset the round time
      io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
    }
  });

  socket.on("initGame", (lobbyCode, userData, gameType) => {
    console.log("init game triggered"); // log
    if (!liveGames[lobbyCode]) {
      console.log("no game"); // log
      socket.join(lobbyCode);
      socketMap.set(socket.id, lobbyCode);
      liveGames[lobbyCode] = new Game(gameType);
      liveGames[lobbyCode].lobbyCode = lobbyCode;
      liveGames[lobbyCode].players[0].id = userData.userID;
      liveGames[lobbyCode].players[0].displayName = userData.displayName;
      liveGames[lobbyCode].players[0].profilePic = userData.profilePic;
      io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
      // console.log(socketMap); // LOG
      // console.log(liveGames); // LOG
    } else if (liveGames[lobbyCode]) {
      console.log("is game"); // log
      let playerCount = liveGames[lobbyCode]["players"].length;

      if (playerCount == 2) {
        socket.emit("eject", { title: "Lobby is Full!", message: "That lobby is already full." });
      } else if (playerCount == 1) {
        if (liveGames[lobbyCode].players[0].id === userData.userID) {
          socket.emit("eject", { title: "Cannot Join Game!", message: "You cannot join your own game." });
        }
        socket.join(lobbyCode);
        socketMap.set(socket.id, lobbyCode);
        liveGames[lobbyCode].players[1] = new Player();
        liveGames[lobbyCode].players[1].id = userData.userID;
        liveGames[lobbyCode].players[1].displayName = userData.displayName;
        liveGames[lobbyCode].players[1].profilePic = userData.profilePic;
        liveGames[lobbyCode].stage = "planting";
        io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
        // console.log(socketMap); // LOG
        // console.log(liveGames); // LOG
      }
    }

    // socket.join(lobbyCode);
    // console.log(`user: ${userID} joined lobby: ${lobbyCode}`);
  })

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected because: ${reason}`); // LOG
    if(socketMap.has(socket.id)) { // if you're mapped to a game
      let whichGame = socketMap.get(socket.id); // save the lobby code of that game
      let gameEndSwitch = false; // assume you didnt DC from the gameend screen

      socketMap.delete(socket.id); // remove you from the map of live games

      if(liveGames[whichGame]) { // if the gamestate is still in the array
        gameEndSwitch = liveGames[whichGame].stage === "gameend"; // check if you dc'd on the gameend screen
        delete liveGames[whichGame]; // delete the game from liveGames
      }

      if(gameEndSwitch) { // if you disconnected on the gameend screen
        io.in(whichGame).socketsLeave(whichGame); // sockets dc from the room without redirect
      } else if(!gameEndSwitch) { // if you disconnected NOT on the gameend screen
        io.sockets.in(whichGame).emit("eject", { title: "Game Cancelled!", message: "Your opponent disconnected." }); // kick everyone from the game (carry toast message)
      }
    }
    // console.log(liveGames); // LOG
  });
});

server.once("error", (err) => {
  console.log(err);
});

server.listen(5000, () => {
  console.log("WS: Listening on port 5000");
});

export default io;

function startGameLoop(lobbyCode, gameState) {
  const loopInterval = setInterval(() => {
    let oldScores = [gameState.players[0].score, gameState.players[1].score];
    
    const newGameState = gameLoop(gameState);

    if(!liveGames[lobbyCode]) { // if the game is no longer live
      clearInterval(loopInterval); // clear the gameloop
      return; // and return early
    }
    
    if(!newGameState.roundTime > 0) { // if round timer hit 0
      newGameState.stage = "roundend"; // set the stage to roundend
      newGameState.lastRoundResult = "time"; // time was the winner here
      clearInterval(loopInterval); // clear the gameloop
    } else if(newGameState.players[0].score !== oldScores[0] || newGameState.players[1].score !== oldScores[1]) { // if either players score changed from the last loop
      if(newGameState.players[0].score === newGameState.scoreLimit || newGameState.players[1].score === newGameState.scoreLimit) { // if either players score hits scorelimit
        newGameState.stage = "gameend"; // set the stage to gameend
        clearInterval(loopInterval); // clear the gameloop
      } else { // if no one hit the scorelimit
        newGameState.stage = "roundend"; // set the stage to roundend
        newGameState.lastRoundResult = newGameState.players[0].score === oldScores[0] ? newGameState.players[1].id : newGameState.players[0].id; // if one players score didnt change from the last round then we know the other player won
        clearInterval(loopInterval); // clear the gameloop
      }
    }

    liveGames[lobbyCode] = newGameState;
    io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
  }, _GAMEINTERVAL);
}

function gameLoop(gameState) {
  let newState = gameState;

  if(!gameState.roundTime > 0) return newState; // if theres no time on the clock just return

  newState.roundTime = gameState.roundTime - _GAMEINTERVAL; // decrement the round timer

  if(gameState.players[0].location === gameState.players[1].location) { // if players bump
    // if neither player is at a base
    if(gameState.players[0].location !== gameState.players[0].base && gameState.players[1].location !== gameState.players[0].base && gameState.players[0].location !== gameState.players[1].base && gameState.players[1].location !== gameState.players[1].base) {
      if(gameState.players[0].carrying || gameState.players[1].carrying) { // if either player is carrying
        newState.players[0].carrying = false; // send flag back to base
        newState.players[1].carrying = false; // send flag back to base
      }
    }
  }

  if(gameState.players[0].location === gameState.players[1].base) { // if 0 goes to 1 base
    if(!gameState.players[0].carrying) { // and 0 is not already carrying
      newState.players[0].carrying = true; // 0 is now carrying
    }
  }
  if(gameState.players[0].location === gameState.players[0].base) { // if 0 back at base
    if(gameState.players[0].carrying) { // and 0 is carrying
      newState.players[0].score = gameState.players[0].score + 1; // 0 score increases
      newState.players[0].carrying = false;
      newState.players[1].carrying = false;
    }
  }

  if(gameState.players[1].location === gameState.players[0].base) { // if 1 goes to 0 base
    if(!gameState.players[1].carrying) { // and 1 is not already carrying
      newState.players[1].carrying = true; // 1 is now carrying
    }
  }
  if(gameState.players[1].location === gameState.players[1].base) { // if 1 back at base
    if(gameState.players[1].carrying) { // and 1 is carrying
      newState.players[1].score = gameState.players[1].score + 1; // 1 score increases
      newState.players[0].carrying = false;
      newState.players[1].carrying = false;
    }
  }

  return newState;
}