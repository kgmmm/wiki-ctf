import { writable } from "svelte/store";

export const splash = writable({
  text: undefined,
});

/*
{
  text: String || undefined,
}

OR

"loader"
*/

