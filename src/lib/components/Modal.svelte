<script>
  import { createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Loader from "./Loader.svelte";

  export let gameState;

  let readyLoader = false;

  let gameWinner;
  let roundWinner;

  $: if(gameState.stage == "gameend") {
    gameWinner = gameState["players"].find(player => player.score >= gameState.scoreLimit);
  }

  $: if(gameState.stage == "roundend" && gameState.lastRoundResult !== "time") {
    roundWinner = gameState["players"].find(player => player.id === gameState.lastRoundResult);
  }

  const dispatch = createEventDispatcher();

  function handleDisconect() {
    dispatch("disconnect");
  }

  function handleReady() {
    readyLoader = true;
    dispatch("roundReady");
  }
</script>

<div class="container" in:fly={{y: 50, duration: 250}}>
  {#if gameState.stage == "roundend"}
    {#if gameState.lastRoundResult == "time"}
      <h2>Time ran out!</h2>
      <span>...round is a draw.</span>
    {:else}
      <div class="profilepic">
        <img src={roundWinner.profilePic} alt={`${roundWinner.userID}'s profile picture`} class="profilepic" referrerpolicy="no-referrer">
      </div>
      <h1 class="char-limit">{roundWinner.displayName}</h1><span>...won&nbsp;this&nbsp;round!</span>
    {/if}
    <h3>{gameState.players[0].score} - {gameState.players[1].score}</h3>
    <h4>Ready for the next round?</h4>
    <div class="buttons">
      <button class="disconnect" title="Disconnect" on:click={handleDisconect}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
        </svg>
      </button>
      <button class="ready" on:click={handleReady}>
        {#if readyLoader}
          <Loader size="35" color="#fff" />
        {:else}
          Ready
        {/if}
      </button>
    </div>
  {:else if gameState.stage == "gameend"}
    <div class="profilepic">
      <img src={gameWinner.profilePic} alt={`${gameWinner.userID}'s profile picture`} class="profilepic" referrerpolicy="no-referrer">
    </div>
    <h1 class="char-limit">{gameWinner.displayName}</h1><span>...won&nbsp;the&nbsp;game!</span>
    <h3>{gameState.players[0].score} - {gameState.players[1].score}</h3>
    <h4>Be a little quicker next game.</h4>
    <div class="buttons">
      <button class="disconnect" title="Disconnect" on:click={handleDisconect}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
        </svg>
      </button>
      <button class="ready" disabled>
        Ready
      </button>
    </div>
  {/if}
</div>
<div class="shadow" in:fade={{duration: 300}}></div>

<style>
  div.shadow {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 25%);
    z-index: 799;
  }

  div.container {
    padding: 33px;
    width: 500px;
    height: 380px;
    color: #000;
    background: #fff;
    background: linear-gradient(-120deg, rgb(0, 0, 0, 5%) 0% 10%, transparent 10% 90%, rgb(0, 0, 0, 5%) 90% 100%), #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 20%);
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 900;
    text-align: center;
    display: grid;
    place-items: center;
  }

  div.profilepic {
    width: 70px;
    height: 70px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    border: solid 2px rgba(0, 0, 0, 30%);
  }
  div.profilepic img.profilepic {
    width: 100%;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #000;
    max-width: 300px;
  }
  span {
    font-size: 1.2rem;
    font-weight: 500;
    color: #000;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #000;
  }
  h3 {
    font-size: 4.2rem;
    font-weight: 700;
    font-family: 'Courier New', Courier, monospace;
    color: #000;
  }
  h4 {
    font-size: 1rem;
    font-weight: 400;
    color: #000;
  }

  div.buttons {
    width: 100%;
    max-width: 320px;
    min-height: 2.7rem;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-template-columns: 1fr 1fr;
  }
  div.buttons button {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    border: none;
    cursor: pointer;
  }

  button.disconnect {
    background: rgba(0, 0, 0, 20%);
    color: rgba(0, 0, 0, 50%);
  }
  button.disconnect svg {
    width: 1em;
    height: 1em;
    font-size: 1.3rem;
    fill: currentColor;
  }

  button.ready {
    color: #fff;
    background: var(--blue-hsl);
    font-size: 1.1rem;
    font-weight: 500;
  }
  button.ready:hover {
    background: var(--blue-highlight);
  }

  button.ready[disabled] {
    opacity: 50%;
    cursor: not-allowed;
  }
  button.ready[disabled]:hover {
    background: var(--blue-hsl);
  }
</style>