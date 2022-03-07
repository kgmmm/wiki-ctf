<script>
  import SignInOut from "$lib/components/SignInOut.svelte";
  import LandingView from "$lib/components/LandingView.svelte";
  import { authStore } from "$lib/stores/authStore";

  import { goto } from "$app/navigation";

  import ShortUniqueId from 'short-unique-id';
  import { toast } from "$lib/stores/toast";

  const newLobbyCode = new ShortUniqueId({ length: 28 });

  let lobbyCode;

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
      } else if(data["players"].length === 2) {
        toast.set({
          title: "Lobby is Full!",
          message: "That lobby is already full.",
        });
      } else if(data["players"].length === 1) {
        goto("/game/" + lobbyCode);
      }
    })
    .catch((error) => console.log(error));
  }

  function createLobby() {
    goto("/game/" + newLobbyCode());
  }
</script>

<LandingView />
<aside>
  {#if !$authStore.isLoggedIn}
    <div class="userWarning">
      <h3>Sign in to play<br />Wikipedia<br />Capture the Flag!</h3>
    </div>
  {:else if $authStore.isLoggedIn}
    <div class="gameMenu">
      <button class="createLobby" on:click={createLobby}>Create a lobby</button>
      <span>OR</span>
      <h3>Join a lobby:</h3>
      <form on:submit|preventDefault={lobbyCodeSubmit}>
        <input type="text" placeholder="Paste code and hit ENTER" bind:value={lobbyCode} class="lobbyCode" required minlength="28" maxlength="28"  autocomplete="off">
      </form>
    </div>
  {/if}
  <SignInOut />
</aside>

<style>
  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 1fr 100px;
    grid-template-areas:
      "content"
      "user";
    background: var(--red-hsl);
    box-shadow: 0 0 5px rgba(0, 0, 0, 25%);
  }

  div.userWarning {
    display: grid;
    place-items: center;
    text-align: center;
  }

  div.userWarning h3 {
    font-size: 2rem;
  }

  div.gameMenu {
    display: grid;
    place-content: center;
    text-align: center;
  }

  button.createLobby {
    width: 250px;
    height: 60px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    background: var(--blue-hsl);
    border: none;
    cursor: pointer;
  }
  button.createLobby:hover {
    background: var(--blue-highlight);
  }

  div.gameMenu span {
    margin-block: 1em;
    font-weight: 400;
    font-size: 0.9rem;
    opacity: 75%;
  }

  div.gameMenu h3 {
    font-size: 1rem;
    font-weight: 500;
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
    border: none;
    border-radius: 3px;
    background: rgba(255, 255, 255, 15%);
  }
  input[type="text"].lobbyCode::placeholder {
    color: rgba(255, 255, 255, 50%);
  }
  input[type="text"].lobbyCode:focus {
    outline: solid 2px yellow;
  }
</style>