import { io, liveGames } from "$lib/server/socketio";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith("/api/lobby/")) {
    let lobbyCode = event.url.pathname.substring(11);
    let targetGame = liveGames[lobbyCode];

    if(targetGame) {
      return new Response(JSON.stringify(targetGame));
    }
  }

  if (event.url.pathname === "/api/games/" || event.url.pathname === "/api/games") {
    if(Object.keys(liveGames).length > 0) { // if there are any liveGames right now
      let PublicGames = []; // instantiate the queue array
      let keys = Object.keys(liveGames); // save an array of all the keys

      for (let i = 0; i < keys.length; i++) { // loop through all the games
        const game = liveGames[keys[i]]; // get the game data from liveGames at the entry from the keys array

        // if the game has only 1 player who is waiting in a public lobby
        if(game["players"].length == 1 && game.stage == "waiting" && game.public == true) PublicGames.push(game); // push the game to the queue array
      }

      return new Response(JSON.stringify(PublicGames));
    }
	}
 
	const response = await resolve(event);
	return response;
}