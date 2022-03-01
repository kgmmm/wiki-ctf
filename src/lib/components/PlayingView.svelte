<script>
  import { onMount } from "svelte";
  import { splash } from "$lib/stores/splash";


  export let gameState;
  export let opponentData;
  export let myData;

  
  function calcTime(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = ((time % 60000) / 1000).toFixed(0);
    return (
      seconds == 60 ?
      ("0" + minutes + 1) + ":00" :
      "0" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
  }

  $: roundTime = calcTime(gameState.roundTime);

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
    <div class="opponentScore">
      {opponentData.score}
    </div>
    <div class="timer">
      {roundTime}
    </div>
    <div class="myScore">
      {myData.score}
    </div>
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
    grid-template-rows: 1fr 89px 1fr;
  }

  div.opponent, div.me, div.scoreboard, div.timer, div.opponentScore, div.myScore {
    display: grid;
    place-items: center;
    text-align: center;
  }

  div.scoreboard {
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    background: linear-gradient(240deg, var(--blue) 50%, var(--red) 0%);
    padding-block: 7px;
    grid-template-columns: 75px 33px 1fr 33px 75px;
    grid-template-rows: 1fr 1fr;
    gap: 7px;
    grid-template-areas:
      "mScore obtn timer mbtn oScore"
      "mScore obtn timer mbtn oScore";
  }

  div.timer, div.opponentScore, div.myScore {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 20%);
    border-radius: 5px;
  }

  div.opponentScore {
    grid-area: oScore;
    border-radius: 0 5px 5px 0;
    font-size: 1.5rem;
    position: relative;
  }
  div.myScore {
    grid-area: mScore;
    border-radius: 5px 0 0 5px;
    font-size: 1.5rem;
    position: relative;
  }

  div.opponentScore::after, div.myScore::after {
    content: "points";
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #fff;
    opacity: 70%;
  }

  div.timer {
    grid-area: timer;
    font-size: 1.5rem;
  }
</style>