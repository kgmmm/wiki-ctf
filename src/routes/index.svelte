<script>
  import SignInOut from "$lib/components/SignInOut.svelte";
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
      if(data.isGame === true && data.numPlayers === 1) {
        goto("/game/" + lobbyCode);
      } else if (data.isGame === true) {
        toast.set({
          title: "Lobby is Full!",
          message: "That lobby is already full.",
        });
      } else if (data.isGame === false) {
        toast.set({
          title: "Invalid Lobby Code!",
          message: "That lobby does not exist.",
        });
      }
    })
    .catch((error) => console.log(error));
  }

  function createLobby() {
    goto("/game/" + newLobbyCode());
  }
</script>

<article>
  <div class="wrapper">
    <div class="blurb">
      <h1>Wikipedia Capture the Flag!</h1>
      <p><span>Sign in</span>
      and invite a friend to play a head-to-head game of Wikipedia Capture the Flag!

      <span>Plant your flag</span>
      on a Wikipedia page of your choosing.

      <span>Ready-up</span>
      and race through Wikipedia links to capture your opponents flag.

      <span>Hurry back</span>
      to base with their flag to score a point, and let the next round begin.

      <span>Watch out</span>
      for interceptions! If a flag carrier is intercepted, any flags will sent back to base.

      <span>Beware</span>
      of dead ends! If you happen upon a page with no more links, you will be sent home, and lose a point.</p>
    </div>
    <div class="tips">
      <h3>Tips</h3>
      <ul>
        <li>I know what you're thinking, but the back button isn't going to help you here.</li>
        <li>A lot of page links have been disabled to keep you on the straight and narrow.</li>
      </ul>
    </div>
  </div>
  <img src="/img/flag-globe.svg" alt="Flag Globe Logo" class="flag-globe-bg">
</article>
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
  article {
    display: grid;
    place-items: center;
    background: var(--red);
    position: relative;
    z-index: -1;
  }

  img.flag-globe-bg {
    position: absolute;
    bottom: -10rem;
    right: -16rem;
    width: 70rem;
    max-width: unset;
    height: 70rem;
    aspect-ratio: 1 / 1;
    z-index: -1;
    opacity: 25%;
    pointer-events: none;
    user-select: none;
  }

  div.wrapper {
    margin-left: 2rem;
    margin-right: 2rem;
  }

  div.blurb {
    width: 100%;
    max-width: 870px;
  }
  div.blurb h1 {
    font-size: 3rem;
    margin-bottom: 0.75em;
  }
  div.blurb span {
    font-weight: 600;
    font-size: 1.6rem;
  }
  div.blurb p {
    font-size: 1.1rem;
    line-height: 1.9rem;
  }

  div.tips {
    margin-top: 3rem;
    padding: 1em 1.5em;
    width: max-content;
    font-size: 0.95rem;
    border: solid 1px #000;
    border-radius: 10px;
    background: rgba(0, 0, 0, 10%);
  }  
  div.tips ul {
    margin-block: 0.6em;
    margin-left: 1em;
  }
  div.tips ul li {
    list-style-type: '🏳️';
    margin-bottom: 0.2em;
    padding-left: 0.5em;
  }

  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 1fr 100px;
    grid-template-areas:
      "content"
      "user";
    background: var(--red);
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
    background: var(--blue);
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