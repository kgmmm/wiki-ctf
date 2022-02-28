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
    }, 1500);

    return () => {
      clearInterval(removeSplash);
    }
  });
</script>

<div class="container">
  <div class="opponent">
    <h1>{opponentData.base}</h1>
    <h1>{opponentData.location}</h1>
  </div>

  <div class="scoreboard">
    <h2>{gameState.roundTime}</h2>
  </div>

  <div class="me">
    <h1>{myData.location}</h1>
    <h1>{myData.base}</h1>
  </div>
</div>

<style>
  div.container {
    grid-area: content;
    display: grid;
    grid-template-rows: 1fr 100px 1fr;
  }

  div.opponent, div.me, div.scoreboard {
    display: grid;
    place-items: center;
    text-align: center;
  }
</style>