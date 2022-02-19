import http from "http";
import { Server as SocketIO } from "socket.io";

const server = http.createServer();
const io = new SocketIO(server, {
  cors: {
    origin: "*",
  },
});

let liveGames = [];

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
//     }
//   ]
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
}
let socketMap = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected.`);

  socket.on("fetchedPage", (userID, data) => {
    console.log(`${userID} fetched page: '${data.pageid}' with title '${data.title}' on socket ${socket.id}`);
    socket.emit("returnTitle", data.title);
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
        socket.emit("lobbyFull");
      } else if (playerCount == 1) {
        socket.join(lobbyCode);
        socketMap.set(socket.id, lobbyCode);
        liveGames[lobbyCode].players[1] = new Player();
        liveGames[lobbyCode].players[1].id = userData.userID;
        liveGames[lobbyCode].players[1].displayName = userData.displayName;
        liveGames[lobbyCode].players[1].profilePic = userData.profilePic;
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
        liveGames = liveGames.filter(game => game !== whichGame); // delete the game from liveGames
      }
      io.sockets.in(whichGame).emit("pop", { title: "Game Cancelled!", message: "Your opponent disconnected." }); // pop some toast saying someone DC'd
      io.sockets.in(whichGame).emit("eject"); // kick everyone from the game
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