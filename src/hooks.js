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

  if (event.url.pathname === "/api/games/" || event.url.pathname === "/api/games") { // TODO: CHANGE THIS TO ONLY INCLUDE 'PUBLIC: TRUE' GAMES AND USE THIS FOR MATCHMAKING
    if(Object.keys(liveGames).length > 0) {
      let gamesObj = {...liveGames};

      return new Response(JSON.stringify(gamesObj));
    }
	}
 
	const response = await resolve(event);
	return response;
}