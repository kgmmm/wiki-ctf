<script>
  import SignInOut from "$lib/components/SignInOut.svelte";
  import LandingView from "$lib/components/LandingView.svelte";
  import { authStore } from "$lib/stores/authStore";

  import { goto } from "$app/navigation";

  import ShortUniqueId from 'short-unique-id';
  import { toast } from "$lib/stores/toast";
  import Loader from "$lib/components/Loader.svelte";
  import { fade } from "svelte/transition";

  const newLobbyCode = new ShortUniqueId({ length: 28 });

  let lobbyCode;

  let quickPlayLoader = false;

  function lobbyCodeSubmit() {
    fetch("/api/lobby/" + lobbyCode, {
      method: "GET",
      mode: "no-cors",
    })
    .then(response => response.json())
    .then(data => {
      if(!data["players"]) {
        toast.set({
          title: "Invalid Lobby Code!",
          message: "That lobby does not exist.",
        });
        lobbyCode = "";
      } else if(data["players"].length === 2) {
        toast.set({
          title: "Lobby is Full!",
          message: "That lobby is already full.",
        });
        lobbyCode = "";
      } else if(data["players"].length === 1) {
        goto("/game/" + lobbyCode);
      }
    })
    .catch((error) => {
      toast.set({
        title: "Fetch Error!",
        message: "Error fetching data from server.",
      });
    });
  }

  function createLobby() {
    goto("/game/" + newLobbyCode());
  }

  function quickPlay() {
    quickPlayLoader = true;
    fetch("/api/games/", {
      method: "GET",
      mode: "no-cors",
    })
    .then(response => response.json())
    .then(data => {
      if(data.length > 0 && data[0].lobbyCode) { // there are games
        goto("/game/" + data[Math.floor(Math.random() * data.length)].lobbyCode); // pick one at random and join it
      } else {
        // no games
        // create a new public game and sit waiting
        goto("/game/" + newLobbyCode() + "?type=public");
      }
    })
    .catch((error) => {
      toast.set({
        title: "Quick Play Failed!",
        message: "Failed to join quick play.",
      });
      quickPlayLoader = false;
    });
  }
</script>

<svelte:head>
  <title>Wiki CTF</title>
</svelte:head>

<LandingView />
<aside out:fade={{ duration: 0 }}>
  {#if !$authStore.isLoggedIn}
    <div class="userWarning">
      <h3>Sign in to play<br />Wikipedia<br />Capture the Flag!</h3>
    </div>
  {:else if $authStore.isLoggedIn}
    <div class="gameMenu">
      <button class="playButton" disabled={quickPlayLoader} on:click={quickPlay}>
        {#if quickPlayLoader == true}
          <Loader size="40" color="#fff" />
        {:else}
          Quick play
        {/if}
      </button>
      <button class="playButton" on:click={createLobby}>Play a friend</button>
      <span>OR</span>
      <h3>Join a lobby:</h3>
      <form on:submit|preventDefault={lobbyCodeSubmit}>
        <input type="text" placeholder="Paste code and hit ENTER" bind:value={lobbyCode} class="lobbyCode" required minlength="28" maxlength="28"  autocomplete="off" spellcheck="false">
      </form>
    </div>
  {/if}
  <SignInOut />
</aside>

<style>
  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 95px 1fr 95px;
    grid-template-areas:
      "."
      "content"
      "user";
    background: var(--red-hsl);
    box-shadow: 0 0 5px rgba(0, 0, 0, 50%);
  }

  div.userWarning {
    grid-area: content;
    display: grid;
    place-items: center;
    text-align: center;
  }

  div.userWarning h3 {
    font-size: 2rem;
  }

  div.gameMenu {
    grid-area: content;
    display: grid;
    place-content: center;
    text-align: center;
  }

  button.playButton {
    margin-bottom: 15px;
    width: 250px;
    height: 60px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    background: var(--blue-hsl);
    border: solid 1px var(--blue-dark-15);
    border-radius: 5px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  button.playButton:hover {
    background: var(--blue-light-5);
  }

  button.playButton:nth-of-type(2) {
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    width: 200px;
    height: 50px;
    place-self: center;
    background: var(--red-light-5);
    border: solid 1px var(--red-dark-15);
  }
  button.playButton:nth-of-type(2):hover {
    text-decoration: underline;
  }

  div.gameMenu span {
    margin-block: 1em;
    font-weight: 400;
    font-size: 0.9rem;
    color: var(--red-dark-25);
    background: radial-gradient(var(--red-hsl), var(--red-hsl)), linear-gradient(0deg, transparent 50%, var(--red-dark-20) 50%, transparent 51% 100%);
    background-size: 50px 50px, 100% 100%;
    background-position: center, top;
    background-repeat: no-repeat, no-repeat;
  }

  div.gameMenu h3 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 80%;
    color: white;
  }

  input[type="text"].lobbyCode {
    margin-block: 1em;
    padding: 0.5em;
    width: 250px;
    height: 2rem;
    text-align: center;
    font-size: 0.8rem;
    font-family: 'Courier New', Courier, monospace;
    color: black;
    border: solid 1px var(--red-dark-15);
    border-radius: 3px;
    background: var(--red-dark-5);
  }
  input[type="text"].lobbyCode::placeholder {
    color: #fff;
    opacity: 60%;
  }
  input[type="text"].lobbyCode:focus {
    outline: solid 2px yellow;
  }
</style>