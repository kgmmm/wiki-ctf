
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
	let noLobby = false;

	return {
		body: noLobby
	};
};