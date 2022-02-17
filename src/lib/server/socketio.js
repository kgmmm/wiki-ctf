import http from "http";
import { Server as SocketIO } from "socket.io";

const server = http.createServer();
const io = new SocketIO(server, {
  cors: {
    origin: "*",
  },
});

let liveGames = [];
let freshGameState = {
  lobbyCode: undefined,
  stage: "waiting", // first stage of the game is waiting for player 2 to join
  roundTime: 180000, // 3 minutes in MS
  scoreLimit: 3, // first to 3 points is the winner
  numFlagsCarried: 0, // 0 = no flags, 1 = players[0] carrying, 2 = players[1] carrying, 3 = both players carrying
  players: [
    {
      id: undefined,
      planted: false,
      score: 0,
      location: undefined,
      base: undefined,
      displayName: undefined,
      profilePic: undefined,
    }
  ]
}
let newPlayer = {
  id: undefined,
  planted: false,
  score: 0,
  location: undefined,
  base: undefined,
  displayName: undefined,
  profilePic: undefined,
}

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
      liveGames[lobbyCode] = freshGameState;
      liveGames[lobbyCode].lobbyCode = lobbyCode;
      liveGames[lobbyCode].players[0].id = userData.userID;
      liveGames[lobbyCode].players[0].displayName = userData.displayName;
      liveGames[lobbyCode].players[0].profilePic = userData.profilePic;
      io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
    } else if (liveGames[lobbyCode]) {
      console.log("is game"); // log
      let playerCount = liveGames[lobbyCode]["players"].length;

      if (playerCount == 2) {
        socket.emit("lobbyFull");
      } else if (playerCount == 1) {
        socket.join(lobbyCode);
        liveGames[lobbyCode].players[1] = newPlayer;
        liveGames[lobbyCode].players[1].id = userData.userID;
        liveGames[lobbyCode].players[1].displayName = userData.displayName;
        liveGames[lobbyCode].players[1].profilePic = userData.profilePic;
        io.sockets.in(lobbyCode).emit("gameStateUpdate", liveGames[lobbyCode]);
      }
    }

    // socket.join(lobbyCode);
    // console.log(`user: ${userID} joined lobby: ${lobbyCode}`);
  })

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected because: ${reason}`); // LOG
  });
});

server.once("error", (err) => {
  console.log(err);
});

server.listen(5000, () => {
  console.log("WS: Listening on port 5000");
});

export default io;