<script>
  import { splash } from '$lib/stores/splash';
  import Loader from "$lib/components/Loader.svelte";
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();

  export let freeze = true;
  export let searchError = false;

  let loader = false;

  let time = 30;
  let countdown = false;

  let searchQuery;
  export let lastSuccess;

  let threeSeconds;

  onMount(() => {
    let i = 3;
    threeSeconds = setInterval(() => {
      if(i === "GO") {
        splash.set({
          text: undefined,
        });
        return clearInterval(threeSeconds);
      } else if(i == 0) {
        i = "GO";
        splash.set({
          text: i,
        });
        countdown = true;
        freeze = false;
        startCountdown();
      } else {
        splash.set({
          text: i,
        });
        i--;
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(threeSeconds);
    clearInterval(thirtySeconds);
    splash.set({
      text: undefined,
    });
  });

  let thirtySeconds;
  
  function startCountdown() {
    thirtySeconds = setInterval(() => {
      if(time == 0 || countdown == false) {
        clearInterval(thirtySeconds);
        console.log("ZEROOOOO");
        splash.set({
          text: "Waiting...",
        });
        loader = true;
        freeze = true;
      }
      time--;
    }, 1000);
  }
  
  // let sleeper;

  // onMount(async () => {
  //   const sleep = (ms = 5000) => new Promise((r) => sleeper = setTimeout(r, ms));
  //   for (let i = 3; i >= 0; i--) {
  //     if(i === 0) i = "GO";
  //     splash.set({
  //       text: i,
  //     });
  //     await sleep(1000);
  //   }
  //   splash.set({
  //     text: undefined,
  //   });
  //   freeze = false;
  //   countdown = true;
  //   startTimer();
  // });

  // let countdownTimer;

  // function Timer() {
	// 	clearInterval(countdownTimer);
	// 	return new Promise(function(resolve, reject) {
	// 		countdownTimer = setInterval(function() {
	// 			time--;
	// 		if (time == 0 || countdown == false) {
	// 			clearInterval(countdownTimer);
	// 			resolve();
	// 		}
	// 		}, 1000);
	// 	});
	// }

  // async function startTimer() {
  //   await Timer();
  //   console.log("ZEROOOOO"); // whatever point countdown is terminated at, this will run.
  //   splash.set({
  //     text: "Waiting...",
  //   });
  //   loader = true;
  //   freeze = true;
  // }

  function search() {
    dispatch("search", {
      query: searchQuery,
    });
    searchQuery = "";
  }

  function plantFlag() { // TEMP
    console.log("Plant Flag");
  }
</script>

<div>
  {#if !loader}
    <h1>{time}</h1>
  {:else if loader}
    <Loader size="70" color="#fff" />
  {/if}
  <p>Search for an article and plant your flag!</p>
  <form on:submit|preventDefault={search}>
    <input type="text" disabled={freeze} bind:value={searchQuery} required>
    <button title="Search" type="submit" class="search" disabled={freeze}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
    </button>
    {#if searchError}
      <strong>Try something else</strong>
    {/if}
  </form>
  <button class="plant" disabled={!lastSuccess || freeze} on:click={plantFlag}>Plant Flag</button>
</div>

<style>
  div {
    grid-area: content;
    width: 100%;
    height: min-content;
    place-self: center;
    display: grid;
    place-items: center;
    grid-template-rows: 10rem min-content 8rem min-content;
    text-align: center;
    overflow: hidden;
  }

  h1 {
    font-size: 4.5rem;
  }

  p {
    font-size: 1rem;
    max-width: 180px;
  }

  form {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: max-content max-content;
    align-items: center;
    place-items: center;
    position: relative;
  }

  strong {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.9rem;
  }

  button.search {
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    background: white;
    border: none;
    border-radius: 0 3px 3px 0;
    cursor: pointer;
  }
  button.search[disabled] {
    cursor: not-allowed;
  }

  button.search svg {
    fill: black;
    width: 1em;
    height: 1em;
    font-size: 0.9rem;
  }

  input[type="text"] {
    margin-block: 1em;
    padding: 0.5em;
    width: 250px;
    height: 2rem;
    text-align: left;
    font-size: 0.8rem;
    font-family: 'Courier New', Courier, monospace;
    color: #000;
    border: solid 1px rgba(255, 255, 255, 35%);
    border-radius: 3px 0 0 3px;
    background: rgba(255, 255, 255, 15%);
    cursor: text;
    display: inline;
  }
  input[type="text"]:focus {
    outline: solid 2px yellow;
  }
  input[type="text"][disabled] {
    cursor: not-allowed;
  }

  button.plant {
    padding: 0 1.5rem;
    margin-bottom: 5.5rem;
    height: 2.4rem;
    font-size: 1rem;
    color: #fff;
    background: rgba(255, 255, 255, 10%);
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  button.plant:hover {
    background: rgba(255, 255, 255, 15%);
  }

  button.plant[disabled] {
    cursor: not-allowed;
  }
  button.plant[disabled]:hover {
    background: rgba(255, 255, 255, 10%)
  }
</style>