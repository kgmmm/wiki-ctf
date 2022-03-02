import http from "http";
import { Server as SocketIO } from "socket.io";

const server = http.createServer();
const io = new SocketIO(server, {
  cors: {
    origin: "*",
  },
});

let _GAMEINTERVAL = 1000;

export let liveGames = [];

// const freshGameState = {
//   lobbyCode: undefined,
//   stage: "waiting", // first stage of the game is waiting for player 2 to join
//   roundTime: 180000, // 3 minutes in MS
//   scoreLimit: 3, // first to 3 points is the winner
//   players: [
//     {
//       id: undefined, // uid from firebase auth
//       planted: false, // has flag been planted
//       score: 0, // current score
//       location: undefined, // page player is current on
//       base: undefined,// location of planted flag, title
//       carrying: false, // is a flag being carried by this player
//       displayName: undefined, // display name from firebase auth
//       profilePic: undefined, // profile picture from firebase auth
//       ready: Boolean,  // is the playing ready to play (helps with sync)
//     }
//   ],
//  public: Boolean, // is the game open for people searching to play (not implemented yet)
// }
// const newPlayer = {
//   id: undefined,
//   planted: false,
//   score: 0,
//   location: undefined,
//   base: undefined,
//   carrying: false,
//   displayName: undefined,
//   profilePic: undefined,
// }

function Player() {
  this.id = undefined;
  this.planted = false;
  this.score = 0;
  this.location = undefined;
  this.base = undefined;
  this.carrying = false;
  this.displayName = undefined;
  this.profilePic = undefined;
}
function Game() {
  this.lobbyCode = undefined;
  this.stage = "waiting";
  this.roundTime = 180000;
  this.scoreLimit = 3;
  this.players = [];
  this.players[0] = new Player();
  this.public = false;
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

  socket.on("initGame", (lobbyCode, userData) => {
    console.log("init game triggered"); // log
    if (!liveGames[lobbyCode]) {
      console.log("no game"); // log
      socket.join(lobbyCode);
      socketMap.set(socket.id, lobbyCode);
      liveGames[lobbyCode] = new Game();
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
    if(socketMap.has(socket.id)) { // if you were in a game
      let whichGame = socketMap.get(socket.id); // save the lobby code of that game
      socketMap.delete(socket.id); // remove you from the map of live games
      if(liveGames[whichGame]) { // if the gamestate is still in the array
        delete liveGames[whichGame]; // delete the game from liveGames
      }
      io.sockets.in(whichGame).emit("eject", { title: "Game Cancelled!", message: "Your opponent disconnected." }); // kick everyone from the game (carry toast message)
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
      clearInterval(loopInterval); // clear the gameloop
    }

    if(newGameState.players[0].score >= 3 || newGameState.players[1].score >= 3) { // if either players score hits 3
      newGameState.stage = "gameend"; // set the stage to gameend
      clearInterval(loopInterval); // clear the gameloop
    }

    // if either players score changed from the last loop
    if(newGameState.players[0].score !== oldScores[0] || newGameState.players[1].score !== oldScores[1]) {
      newGameState.stage = "roundend"; // set the stage to roundend
      clearInterval(loopInterval); // clear the gameloop
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
    }
  }

  return newState;
}