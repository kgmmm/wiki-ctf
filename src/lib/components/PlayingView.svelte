<script>
  import { onMount } from "svelte";
  import { splash } from "$lib/stores/splash";


  export let gameState;
  export let opponentData;
  export let myData;

  onMount(() => {
    splash.set({
      text: "GO",
    });

    const removeSplash = setTimeout(() => {
      splash.set({
        text: undefined,
      });
    }, 500);

    return () => {
      clearInterval(removeSplash);
    }
  });
</script>

<div>
  <h1>{opponentData.base}</h1>
  <h1>{opponentData.location}</h1>

  <h2>{gameState.roundTime}</h2>

  <h1>{myData.location}</h1>
  <h1>{myData.base}</h1>
</div>

<style>
  /* your styles go here */
</style>