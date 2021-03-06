<script>
  import { splash } from "$lib/stores";
  import Loader from "$lib/components/Loader.svelte";
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { scale } from "svelte/transition";
  import { myData } from "$lib/stores";

	const dispatch = createEventDispatcher();

  export let freeze = true;
  export let searchError = false;
  
  let loader = false;
  
  let time = 30;
  let countdown = false;
  
  let searchQuery;
  export let lastSuccess;

  export let planted;

  $: if(planted == true) {
    countdown = false;
  }

  let threeSeconds;

  onMount(() => {
    freeze = true;

    let i = 3;
    threeSeconds = setInterval(() => {
      if(i === "Plant!") {
        splash.set({
          text: undefined,
        });
        return clearInterval(threeSeconds);
      } else if(i == 0) {
        i = "Plant!";
        splash.set({
          text: i,
        });
        countdown = true;
        freeze = false;
        startCountdown();
      } else {
        splash.set({
          text: i.toString(),
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
        splash.set({
          text: "Waiting...",
        });
        loader = true;
        freeze = true;
        if(planted == false) dispatch("plant", { timer: true });
      }
      time--;
    }, 1000);
  }

  function search() {
    dispatch("search", {
      query: searchQuery,
    });
    searchQuery = "";
  }

  function plantFlag() {
    dispatch("plant", { timer: false });
  }
</script>

<div>
  {#if !loader}
    <h1>{time}</h1>
    <p>Search for an article and plant your flag!</p>
  {:else if loader}
    <Loader size="85" color="#fff" />
    <p>Waiting for opponent to plant their flag.</p>
  {/if}
  <form on:submit|preventDefault={search}>
    <input type="text" disabled={freeze} bind:value={searchQuery} required placeholder="Search">
    <button title="Search" type="submit" class="search" disabled={freeze}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
    </button>
    {#if searchError}
      <strong in:scale={{ duration: 150 }}>Try something else</strong>
    {/if}
  </form>
  <button class="plant" disabled={!lastSuccess || freeze} on:click={plantFlag}>Plant flag</button>
  {#if $myData.location && lastSuccess}
    <output style="font-size: Clamp(0.75rem, {310 / $myData['location'].length / 8 + 'rem'}, 1.2rem);" class:freeze>
      {$myData.location}
    </output>
  {/if}
</div>

<style>
  div {
    grid-area: content;
    width: 100%;
    height: min-content;
    place-self: center;
    display: grid;
    place-items: center;
    grid-template-rows: 10rem min-content 6rem min-content;
    text-align: center;
    position: relative;
    isolation: isolate;
  }

  h1 {
    font-size: 5.5rem;
  }

  p {
    font-size: 1rem;
    max-width: 180px;
  }

  form {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: max-content max-content;
    place-items: center;
    position: relative;
  }

  strong {
    color: var(--red-dark-25);
    position: absolute;
    top: calc(100% - 0.45rem);
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.9rem;
    user-select: none;
  }

  button.search {
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    color: #000;
    background: white;
    border: solid 1px var(--red-dark-15);
    border-left: none;
    border-radius: 0 3px 3px 0;
    cursor: pointer;
  }
  button.search[disabled] {
    cursor: not-allowed;
    background: var(--red-hsl);
    border-color: var(--red-dark-10);
    color: var(--red-dark-10);
  }
  button.search:focus {
    z-index: 999;
  }

  button.search svg {
    fill: currentColor;
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
    border: solid 1px var(--red-dark-15);
    border-right: none;
    border-radius: 3px 0 0 3px;
    background: var(--red-dark-5);
    cursor: text;
    display: inline;
  }
  input[type="text"]:focus {
    outline: solid 2px yellow;
    z-index: 999;
  }
  input[type="text"][disabled] {
    cursor: not-allowed;
    background: var(--red-hsl);
    border-color: var(--red-dark-10);
  }
  input[type="text"]::placeholder {
    color: #fff;
    opacity: 65%;
  }
  input[type="text"][disabled]::placeholder {
    opacity: 0;
  }

  output {
    padding: 0.5rem;
    min-height: 3.5rem;
    width: 100%;
    max-width: 375px;
    border: solid 1px var(--red-dark-15);
    border-radius: 5px;
    font-weight: bolder;
    color: #fff;
    background: var(--red-light-5);
    display: grid;
    place-items: center;
    text-align: center;
    user-select: none;
    position: absolute;
    top: calc(100% - 4.5rem);
    z-index: -1;
  }
  output::before, output::after {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    height: 0;
    width: 0;
    border: solid 20px transparent;
    border-bottom: solid 10px var(--red-dark-15);
  }
  output::after {
    top: -29px;
    border: solid 20px transparent;
    border-bottom: solid 10px var(--red-light-5);
  }

  output.freeze {
    background: transparent;
    border-color: var(--red-dark-10);
    color: var(--red-dark-10);
  }
  output.freeze::before {
    border-bottom-color: var(--red-dark-10);
  }
  output.freeze::after {
    border-bottom-color: var(--red-hsl);
  }

  button.plant {
    margin-bottom: 5.5rem;
    height: 50px;
    width: 160px;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 80%;
    color: #fff;
    background: var(--blue-hsl);
    border: solid 1px var(--blue-dark-15);
    border-radius: 5px;
    cursor: pointer;
  }
  button.plant:hover {
    background: var(--blue-light-5);
  }

  button.plant[disabled] {
    cursor: not-allowed;
    color: var(--red-dark-10);
    background: transparent;
    border: solid 1px var(--red-dark-10);
  }
  button.plant[disabled]:hover {
    background: transparent;
  }
</style>