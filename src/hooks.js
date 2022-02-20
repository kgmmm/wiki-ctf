import { io, liveGames } from "$lib/server/socketio";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith("/api/lobby/")) {
    let lobbyCode = event.url.pathname.substring(11);
    let targetGame = liveGames[lobbyCode];
    
    if(targetGame) {
      let isGame = true;
      return new Response(isGame);
    }
	}

  if (event.url.pathname.startsWith("/api/games")) {
    if(Object.keys(liveGames).length > 0) {
      let gamesObj = {...liveGames};

      return new Response(JSON.stringify(gamesObj));
    }
	}
 
	const response = await resolve(event);
	return response;
}