
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	let noGames = "There are no live games";

	return {
		body: {
			noGames
		}
	};
};