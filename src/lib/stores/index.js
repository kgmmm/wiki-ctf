import { writable, derived } from "svelte/store";

export const authStore = writable({
  isLoggedIn: false,
  userID: undefined,
  displayName: "",
  profilePic: undefined,
});

export const gameState = writable({});

export const myData = derived([gameState, authStore], ([$gameState, $authStore]) => {
  if(!$gameState.players) return;
  return $gameState["players"].find(player => player.id === $authStore.userID);
});
export const opponentData = derived([gameState, authStore], ([$gameState, $authStore]) => {
  if(!$gameState.players) return;
  return $gameState["players"].find(player => player.id!== $authStore.userID);
});

export const mapData = writable();

export const toast = writable({
  title: undefined,
  message: undefined,
});

export const splash = writable({
  text: undefined,
});