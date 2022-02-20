<script>
  import { goto } from "$app/navigation";
  import Loader from "$lib/components/Loader.svelte";

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let lobbyCode;

  let lobbyCodeInput;

  function copyToClipboard() {
    lobbyCodeInput.select();
    lobbyCodeInput.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(lobbyCodeInput.value);
    dispatch("toaster", {
			title: "Copied to clipboard!",
      message: "Lobby code copied to clipboard.",
		});
  }

  function cancelGame() {
    dispatch("cancelGame");
  }
</script>

<div>
  <h1>Waiting for opponent...</h1>
  <Loader size="70" color="#fff"/>
  <p>Send this code to a friend:</p>
  <form on:submit|preventDefault>
    <button title="Copy to clipboard" class="clipboard" on:click={copyToClipboard}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H15.9595C16.5118 13 16.9595 12.5523 16.9595 12C16.9595 11.4477 16.5118 11 15.9595 11H8Z"
          fill="currentColor"
        />
        <path
          d="M8.04053 15.0665C7.48824 15.0665 7.04053 15.5142 7.04053 16.0665C7.04053 16.6188 7.48824 17.0665 8.04053 17.0665H16C16.5523 17.0665 17 16.6188 17 16.0665C17 15.5142 16.5523 15.0665 16 15.0665H8.04053Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM7 5H5L5 19H19V5H17V6C17 7.65685 15.6569 9 14 9H10C8.34315 9 7 7.65685 7 6V5ZM9 5V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V5H9Z"
          fill="currentColor"
        />
      </svg>
    </button>
    <input type="text" disabled value={lobbyCode} bind:this={lobbyCodeInput}>
  </form>
  <button class="cancel" on:click={cancelGame}>Cancel Game</button>
</div>

<style>
  div {
    grid-row: 1 / span 2;
    width: 100%;
    height: min-content;
    place-self: center;
    display: grid;
    place-items: center;
    grid-template-rows: min-content 12rem min-content min-content 5rem;
    text-align: center;
    overflow: hidden;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }

  form {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: max-content max-content;
    align-items: center;
    place-items: center;
  }

  button.clipboard {
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    background: white;
    border: none;
    border-radius: 3px 0 0 3px;
    cursor: pointer;
  }
  button.clipboard:focus {
    outline: solid 2px yellow;
  }
  button.clipboard:focus:not(:focus-visible) {
    outline: none;
  }
  button.clipboard:focus-visible {
    outline: solid 2px yellow;
  }

  button.clipboard svg {
    fill: black;
    width: 1em;
    height: 1em;
    font-size: 1rem;
  }

  input[type="text"] {
    margin-block: 1em;
    padding: 0.5em;
    width: 250px;
    height: 2rem;
    text-align: center;
    font-size: 0.8rem;
    font-family: 'Courier New', Courier, monospace;
    color: #000;
    border: solid 1px rgba(255, 255, 255, 35%);
    border-radius: 0 3px 3px 0;
    background: rgba(255, 255, 255, 15%);
    cursor: text;
    display: inline;
  }

  button.cancel {
    padding: 0 1.5rem;
    height: 2.4rem;
    font-size: 1rem;
    color: #fff;
    background: rgba(255, 255, 255, 10%);
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  button.cancel:hover {
    background: rgba(255, 255, 255, 15%);
  }
  button.cancel:focus {
    outline: solid 2px yellow;
  }
  button.cancel:focus:not(:focus-visible) {
    outline: none;
  }
  button.cancel:focus-visible {
    outline: solid 2px yellow;
  }
</style>