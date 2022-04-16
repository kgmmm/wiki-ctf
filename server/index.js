import { handler } from '../build/handler.js';

import express from 'express';
import http from "http";
import { Server as SocketIO } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*",
  },
});

let _GAMEINTERVAL = 1000;
let _ROUNDTIME = 180000;
let _SCORELIMIT = 3;

let liveGames = [];

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
  this.lobbyCode = undefined;              // lobbyCode used for the game
  this.stage = "waiting";                  // current stage the game is at, 'waiting' : 'planting' : 'playing' : 'roundend' : 'gameend'
  this.currentTime = roundTime;            // current time in the game
  this.gameVARS = [roundTime, scoreLimit]; // gameVARS for this game, round time and score limit
  this.players = [];                       // array of player objects
  this.players[0] = new Player();
  this.lastRoundResult = undefined;        // result of the last round, 'time' : id of player who won the round
  this.gameType = gameType;                // public (join via quickplay), private/null (join via code), custom (private game with custom gameVARS)
}
let socketMap = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected.`); // LOG

  socket.on("fetchedPage", (userID, data) => {
    let lobbyCode = socketMap.get(socket.id);
    let targetPlayer = liveGames[lobbyCode]["players"].find(player => player.id === userID);
    targetPlayer.location = data.title;
    io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);

    console.log(`${lobbyCode}: ${userID} fetched page: '${data.pageid}' on socket ${socket.id}`); // LOG
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
      liveGames[lobbyCode].currentTime = liveGames[lobbyCode].gameVARS[0]; // reset the round time
      io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
    } else {
      io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]); // send updates of roundReady
    }
  });

  socket.on("initGame", (lobbyCode, userData, gameType, roundTime, scoreLimit) => {
    console.log("init game triggered"); // log
    if (!liveGames[lobbyCode]) {
      console.log("no game"); // log
      socket.join(lobbyCode);
      socketMap.set(socket.id, lobbyCode);
      liveGames[lobbyCode] = new Game(gameType, roundTime, scoreLimit);
      liveGames[lobbyCode].lobbyCode = lobbyCode;
      liveGames[lobbyCode].players[0].id = userData.userID;
      liveGames[lobbyCode].players[0].displayName = userData.displayName;
      liveGames[lobbyCode].players[0].profilePic = userData.profilePic;
      io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);

      console.log(`created game: ${lobbyCode}`); // LOG
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

        console.log(`joined game: ${lobbyCode}`); // LOG
      }
    }
  })

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected because: ${reason}`); // LOG
    if(socketMap.has(socket.id)) { // if you're mapped to a game
      let whichGame = socketMap.get(socket.id); // save the lobby code of that game
      let gameEndSwitch = false; // assume you didnt DC from the gameend screen

      let delSockets = [];

      for(let [key, value] of socketMap.entries()) { // for all the entries in the socket map
        if (value === whichGame) delSockets.push(key); // find all the ones mapped to the lobby you just left
      }

      for(let i of delSockets) socketMap.delete(i); // delete them all

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
  });
});

function startGameLoop(lobbyCode, gameState) {
  const loopInterval = setInterval(() => {
    let oldScores = [gameState.players[0].score, gameState.players[1].score];
    
    const newGameState = gameLoop(gameState);

    if(!liveGames[lobbyCode]) { // if the game is no longer live
      clearInterval(loopInterval); // clear the gameloop
      return; // and return early
    }
    
    if(!newGameState.currentTime > 0) { // if round timer hit 0
      newGameState.stage = "roundend"; // set the stage to roundend
      newGameState.lastRoundResult = "time"; // time was the winner here
      clearInterval(loopInterval); // clear the gameloop

      console.log(`game: ${lobbyCode}: roundend`); // LOG

    } else if(newGameState.players[0].score !== oldScores[0] || newGameState.players[1].score !== oldScores[1]) { // if either players score changed from the last loop
      if(newGameState.players[0].score === newGameState.gameVARS[1] || newGameState.players[1].score === newGameState.gameVARS[1]) { // if either players score hits scorelimit
        newGameState.stage = "gameend"; // set the stage to gameend
        clearInterval(loopInterval); // clear the gameloop

      console.log(`game: ${lobbyCode}: gameend`); // LOG
      
      } else { // if no one hit the scorelimit
        newGameState.stage = "roundend"; // set the stage to roundend
        newGameState.lastRoundResult = newGameState.players[0].score === oldScores[0] ? newGameState.players[1].id : newGameState.players[0].id; // if one players score didnt change from the last round then we know the other player won
        clearInterval(loopInterval); // clear the gameloop

        console.log(`game: ${lobbyCode}: roundend`); // LOG
        
      }
    }

    liveGames[lobbyCode] = newGameState;
    io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
  }, _GAMEINTERVAL);
}

function gameLoop(gameState) {
  let newState = gameState;

  if(!gameState.currentTime > 0) return newState; // if theres no time on the clock just return

  newState.currentTime = gameState.currentTime - _GAMEINTERVAL; // decrement the round timer

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

app.get("/api/lobby/:lobbyCode", (req, res) => {
  let lobbyCode = req.params.lobbyCode; // grab the lobbyCode from the url

  if(liveGames[lobbyCode]) { // if the game exists in liveGames
    res.send(JSON.stringify(liveGames[lobbyCode])); // send the game data
  } else {
    res.send({});
  }
});

app.get("/api/games/", (req, res) => {
  if(Object.keys(liveGames).length > 0) { // if there are any live games
    let PublicGames = []; // instantiate the queue array
    let keys = Object.keys(liveGames); // save an array of all the keys

    for (let i = 0; i < keys.length; i++) { // loop through all the games
      const game = liveGames[keys[i]]; // get the game data from liveGames at the entry from the keys array

      // if the game has only 1 player who is waiting in a public lobby
      if(game["players"].length == 1 && game.stage == "waiting" && game.gameType == "public") PublicGames.push(game); // push the game to the queue array
    }
    res.send(JSON.stringify(PublicGames)); // send the array of games its possible to join
  } else {
    res.send({});
  }
});

app.use(handler); // let SvelteKit handle everything else, including serving prerendered pages and static assets

server.once("error", (err) => {
  console.log(err);
});

server.listen(process.env.PORT || 3000, () => {
	console.log('server listening');
});