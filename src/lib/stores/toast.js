import { writable } from "svelte/store";

export const toast = writable({
  title: undefined,
  message: undefined,
});
