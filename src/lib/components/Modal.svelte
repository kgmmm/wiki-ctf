<script>
  import { createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Loader from "./Loader.svelte";
  import Map from "./Map.svelte";

  export let gameState;
  export let myData;
  export let opponentData;

  let readyLoader = false;

  $: result = findResult(gameState); // returns an array with two numbers, 0 round 1 game, 0 loss 1 win 2 draw

  function findResult(state) {
    if(state.stage === "gameend") {
      let gameWinner = state["players"].find(player => player.score >= state.gameVARS[1]);
      return (gameWinner.id === myData.id ? [1, 1] : [1, 0]);
    } else if(state.stage === "roundend") {
      if(state.lastRoundResult === "time") return [0, 2];
      return (state.lastRoundResult === myData.id ? [0, 1] : [0, 0]);
    }
  }

  const dispatch = createEventDispatcher();

  function handleDisconect() {
    dispatch("disconnect");
  }

  function handleReady() {
    if(!readyLoader) {
      readyLoader = true;
      dispatch("roundReady");
    }
  }
</script>

<div class="modal" class:red={result[1] === 1} class:blue={result[1] === 0} class:grey={result[1] === 2} in:fly={{y: 50, duration: 250}}>
  <div class="header">
    {#if result[0] === 0}
      <h1>Round Over</h1>
    {:else if result[0] === 1}
      <h1>Game Over</h1>
    {/if}
    {#if result[1] === 0}
      <h2>You Lose!</h2>
    {:else if result[1] === 1}
      <h2>You Win!</h2>
    {:else}
      <h2>Draw!</h2>
    {/if}
  </div>
  <div class="players">
    <div class="player me" class:winner={result[1] === 1}>
      <div class="profilepic">
        <img src={myData.profilePic} alt="Your pretty face" referrerpolicy="no-referrer">
        {#if result[1] === 1}
          <div class="trophy">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trophy-fill" viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
            </svg>
          </div>
        {/if}
      </div>
      <p>{myData.displayName}</p>
    </div>
    <div class="player opponent" class:winner={result[1] === 0}>
      <div class="profilepic">
        <img src={opponentData.profilePic} alt={`${opponentData.userID}'s profile picture`} referrerpolicy="no-referrer">
        {#if result[1] === 0}
        <div class="trophy">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trophy-fill" viewBox="0 0 16 16">
            <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
          </svg>
        </div>
      {/if}
      </div>
      <p>{opponentData.displayName}</p>
    </div>
  </div>
  <div class="mapContainer">
    <Map />
  </div>
  <div class="message">
    {#if result[0] === 0}
      <h3>Ready for the next round?</h3>
    {:else if result[0] === 1}
      {#if result[1] === 1}
        <h3>Well played!</h3>
      {:else if result[1] === 0}
        <h3>Better luck next time!</h3>
      {/if}
    {/if}
  </div>
  <div class="buttons">
    <button class="disconnect" title="Disconnect" on:click={handleDisconect}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
        <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
      </svg>
    </button>
    <button class="ready" disabled={result[0] === 1 || readyLoader} on:click={handleReady}>
      {#if readyLoader}
        <Loader size="35" color="#fff" />
      {:else}
        Ready
      {/if}
    </button>
  </div>
</div>
<div class="shadow" in:fade={{duration: 300}}></div>

<style>
  div.shadow {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 25%);
    z-index: 799;
  }

  div.modal {
    width: auto;
    height: auto;
    background: #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 20%);
    border-radius: 10px;
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 900;
  }
  div.modal.red {
    --background: var(--red-hsl);
    --border-dark: var(--red-dark-15);
    --background-light: var(--red-light-5);
    --highlight-color: #fff;
  }
  div.modal.blue {
    --background: var(--blue-hsl);
    --border-dark: var(--blue-dark-15);
    --background-light: var(--blue-light-5);
    --highlight-color: #fff;
  }
  div.modal.grey {
    --background: var(--wiki-chrome-bg-color);
    --border-dark: rgba(0, 0, 0, 15%);
    --background-light: rgba(255, 255, 255, 50%);
    --highlight-color: #222;
  }

  div.header {
    width: 100%;
    height: 65px;
    text-align: center;
    color: var(--highlight-color);
    background: var(--background);
    border-radius: 10px 10px 0 0;
    border-bottom: solid 1px var(--border-dark);
    display: grid;
    place-content: center;
  }
  div.header h1 {
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1;
  }
  div.header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1;
  }

  div.players {
    padding: 1rem 7px;
    width: 100%;
    height: max-content;
    display: grid;
    grid-auto-flow: column;
  }

  div.player {
    display: grid;
    place-items: center;
    grid-template-rows: 100px 1fr;
  }
  div.profilepic {
    width: 80px;
    height: 80px;
    position: relative;
    isolation: isolate;
  }
  div.player img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 15%);
    position: relative;
    z-index: -1;
  }
  div.player p {
    font-size: 0.9rem;
    font-weight: 400;
    color: #585858;
  }

  div.trophy {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    color: #fff;
    background: var(--background);
    display: grid;
    place-items: center;
  }
  div.trophy::before {
    content: '';
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: conic-gradient(from 33deg at 50% 50%, transparent, transparent 207deg, #fff 207deg);
    position: absolute;
    z-index: -1;
  }
  div.trophy svg {
    width: 1em;
    height: 1em;
    font-size: 0.75em;
    fill: currentColor;
  }

  div.player.me {
    --background: var(--red-hsl);
  }
  div.player.opponent {
    --background: var(--blue-hsl);
  }

  div.player.winner img {
    box-shadow: 0 0 0 2px #fff, 0 0 0 6px var(--background);
  }

  div.mapContainer {
    margin-left: 7px;
    margin-right: 7px;
    width: 330px;
    height: 330px;
    background: var(--wiki-chrome-bg-color);
    border-radius: 5px;
  }

  div.message {
    width: 100%;
    height: 24px;
    display: grid;
    place-items: center;
  }
  div.message h3 {
    font-size: 0.9rem;
    font-weight: 400;
    color: #222;
  }

  div.buttons {
    padding: 7px;
    gap: 7px;
    width: 100%;
    height: 65px;
    text-align: center;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr;
    background: var(--background);
    border-radius: 0 0 10px 10px;
    border-top: solid 1px var(--border-dark);
  }

  div.buttons button {
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center;
    border-radius: 5px;
    color: var(--highlight-color);
    border: solid 1px var(--border-dark);
    background: var(--background-light);
    font-size: 1rem;
    font-weight: 400;
    text-decoration: none;
    cursor: pointer;
  }
  div.buttons button:hover {
    text-decoration: underline;
  }

  button.disconnect svg {
    width: 1em;
    height: 1em;
    font-size: 1.3rem;
    fill: currentColor;
  }

  button.ready:disabled {
    background: transparent;
    color: var(--border-dark);
    cursor: not-allowed;
  }
  button.ready:disabled:hover {
    text-decoration: none;
  }
</style>