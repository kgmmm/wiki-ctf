<script context="module"> // grab the lobbycode from url path and put it in a variable
  export async function load({ url: { pathname } }) {
    const lobbyCode = pathname.substring(6);
    return { props: { lobbyCode: lobbyCode } };
  }
</script>
<script>
  import io from "socket.io-client";
  import { beforeNavigate, goto } from "$app/navigation";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount, tick } from "svelte";
  import SignInOut from "$lib/components/SignInOut.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Opponent from "$lib/components/Opponent.svelte";
  import WaitingScreen from "$lib/components/WaitingScreen.svelte";
  import { authStore } from "$lib/stores/authStore";
  import { toast } from "$lib/stores/toast";

  export let lobbyCode;

  let socket;
  let gameState = {};
  let opponentData;
  let opponentProps;
  let myData;

  $: {
    if (gameState.players && gameState["players"].length > 1) {
      opponentData = gameState.players.find(player => player.id !== $authStore.userID);
      opponentProps = {
        userID: opponentData.id,
        displayName: opponentData.displayName,
        profilePic: opponentData.profilePic,
      }
      myData = gameState.players.find(player => player.id === $authStore.userID);
    }
  }

  onMount(async () => {
    await tick();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) return;
      goto("/", { replaceState: true, noscroll: false, keepfocus: false, state: {} });
    });

    socket = io("ws://localhost:5000");

    const initializeGame = authStore.subscribe(data => {
      if(data.isLoggedIn) {
        socket.emit("initGame", lobbyCode, { userID: $authStore.userID, displayName: $authStore.displayName, profilePic: $authStore.profilePic, });
      }
    });
    
    socket.on("returnTitle", (title) => {
      returnedTitle = title;
    });

    socket.on("gameStateUpdate", (newState) => {
      console.log(newState); // LOG
      gameState = newState;
    });

    socket.on("eject", () => {
      disconnectFromGame();
    });

    socket.on("lobbyFull", () => {
      disconnectFromGame();
    });

    socket.on("pop", (data) => {
      toast.set({
        title: data.title,
        message: data.message,
      });
    });

    return () => {
      initializeGame;
      socket.disconnect();
    }
  });

  beforeNavigate(() => {
    if(!socket.connected) return;
    socket.disconnect();
  });

  let loading;
  let searchInput;
  let inputDisabled = false;
  let searchError = false;
  let wikiContent;
  let returnedTitle = "";
  let lastSuccess = "";

  async function wikiFetch() {
    if(searchInput == lastSuccess) {
      console.log("same request as before"); // LOG
      return
    }
    console.time("roundtrip"); // LOG
    loading = true;
    inputDisabled = true;

    let apiURL = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&origin=*&page=${searchInput}&redirects`;

    const res = await fetch(apiURL, {
      mode: "cors",
    });
    let response = await res.json();

    console.log(response); // LOG

    if("error" in response) {
      searchError = true;
      loading = false;
      inputDisabled = false;
      console.timeEnd("roundtrip"); // LOG
      return;
    } else {
      searchError = false;
    }

    await socket.emit("fetchedPage", $authStore.userID, { pageid: response.parse.pageid, title: response.parse.title });

    populateArticle(response);
  }

  async function ListenLinks() {
    document.querySelectorAll("#wikiContent a[href]").forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        let targetHref = event.currentTarget.getAttribute("href");

        if (event.currentTarget.classList.contains("external")) return;
        if (!targetHref) return;
        if (targetHref.includes(":")) return;
        if (targetHref.substring(0, 3) === "/w/") return;

        if (targetHref.substring(0, 1) === "#") {
          document.getElementById(targetHref.substring(1)).scrollIntoView();
        }
        if (targetHref.substring(0, 6) === "/wiki/") {
          searchInput = decodeURI(targetHref).substring(6);
          wikiFetch();
        }
      });
    })
  }

  async function populateArticle(response) {
    wikiContent.scrollTop = 0;
    
    // returnedTitle = response.parse.title; -> title gets set by the server now
    wikiContent.innerHTML = response.parse.text["*"];

    console.timeEnd("roundtrip"); // LOG

    lastSuccess = searchInput;
    searchInput = "";

    const addListeners = await ListenLinks(); // set links before removing the cover

    loading = false;
    inputDisabled = false;
  }

  function disconnectFromGame() {
    goto("/", { replaceState: true, noscroll: false, keepfocus: false, state: {} }); // socket disconnection is handled by beforeNavigate
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/style/wiki.css">
</svelte:head>

{#if loading}
  <div class="loaderWrap">
    <Loader size="60" />
  </div>
{/if}
<article id="wikiContent" bind:this={wikiContent}>

</article>
<aside>
  {#if opponentProps}
    <Opponent on:click={disconnectFromGame} {...opponentProps} />
  {:else}
    <WaitingScreen {lobbyCode} on:toaster={(event) => toast.set(event.detail)} on:cancelGame={disconnectFromGame}/>
  {/if}
    <!-- <div class="temp">
      <div class="title">
        <h3>{returnedTitle}</h3>
      </div>
      <form on:submit|preventDefault={wikiFetch}>
        <input type="text" bind:value={searchInput} disabled={inputDisabled}>
        {#if searchError}
          <span class="searchError">Try something else</span>
        {/if}
      </form>
    </div> -->
  <SignInOut />
</aside>

<style>
  div.temp {
    display: grid;
    place-items: center;
  }

  div.loaderWrap {
    background: rgba(0, 0, 0, 25%);
    position: fixed;
    inset: 0;
    right: 400px;
    z-index: 999;
    display: grid;
    place-items: center;
  }

  #wikiContent {
    position: relative;
    z-index: -1;
    color: #000;
    background: #fff;
    padding: 25px;
    overflow-y: scroll;
    scroll-behavior: smooth;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 100px 1fr 100px;
    grid-template-areas:
      "opponent"
      "content"
      "user";
    background: var(--red);
    box-shadow: 0 0 5px rgba(0, 0, 0, 25%);
  }
</style>