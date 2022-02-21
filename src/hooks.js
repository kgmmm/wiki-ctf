import { io, liveGames } from "$lib/server/socketio";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith("/api/lobby/")) {
    let lobbyCode = event.url.pathname.substring(11);
    let targetGame = liveGames[lobbyCode];

    let result = {
      isGame: undefined,
      numPlayers: undefined,
    }

    if (!targetGame) {
      result.isGame = false;
      result.numPlayers = 0;
    } else if(targetGame) {
      result.isGame = true;
      result.numPlayers = targetGame["players"].length;
    }

    return new Response(JSON.stringify(result));
	}

  if (event.url.pathname === "/api/games/" || event.url.pathname === "/api/games") {
    if(Object.keys(liveGames).length > 0) {
      let gamesObj = {...liveGames};

      return new Response(JSON.stringify(gamesObj));
    }
	}
 
	const response = await resolve(event);
	return response;
}