<script context="module">
  export async function load({ url }) {
    const lobbyCode = url.pathname.substring(6); // grab the lobby code from the url pathname

    let gameType = url.searchParams.get("type") || "private"; // get the gametype from the params

    return { props: { lobbyCode: lobbyCode, gameType: gameType, } }; // return props to page
  }
</script>
<script>
  import io from "socket.io-client";
  import { beforeNavigate, goto } from "$app/navigation";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount, tick } from "svelte";
  import SignInOut from "$lib/components/SignInOut.svelte";
  import Opponent from "$lib/components/Opponent.svelte";
  import WaitingView from "$lib/components/WaitingView.svelte";
  import PlantingView from "$lib/components/PlantingView.svelte";
  import PlayingView from "$lib/components/PlayingView.svelte";
  import CustomGameView from "$lib/components/CustomGameView.svelte";
  import { authStore } from "$lib/stores";
  import { toast } from "$lib/stores";
  import { splash } from "$lib/stores";
  import { mapData } from "$lib/stores";
  import Splash from "$lib/components/Splash.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { makeMapData } from "$lib/map";
  import { gameState, myData, opponentData } from "$lib/stores";

  export let lobbyCode;
  export let gameType;

  let socket;

  $: $mapData = makeMapData($gameState, $authStore.userID);

  $: planted = $myData?.planted;

  onMount(async () => {
    await tick();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) return;
      toast.set({
        title: "Not Signed In!",
        message: "You need to sign in to play.",
      });
      goto("/");
    });

    socket = io();

    if(gameType !== "custom") {
      const initializeGame = authStore.subscribe(data => {
        if(data.isLoggedIn) {
          socket.emit("initGame", lobbyCode, { userID: $authStore.userID, displayName: $authStore.displayName, profilePic: $authStore.profilePic, }, gameType);
        }
      });
    }

    socket.on("gameStateUpdate", (newState) => {
      gameState.set(newState);
    });

    socket.on("planted", () => {
      planted = true;
    });

    socket.on("eject", (pop) => {
      toast.set({
        title: pop.title,
        message: pop.message,
      });
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
    gameState.set({});
    socket.disconnect();
  });

  function initCustomGame(event) {
    if($authStore.isLoggedIn) {
      socket.emit("initGame", lobbyCode, {
        userID: $authStore.userID,
        displayName: $authStore.displayName,
        profilePic: $authStore.profilePic,
      }, gameType, event.detail.roundTime, event.detail.scoreLimit);
    }
  }

  let searchQuery;
  let freeze = true;
  let searchError = false;
  let wikiContent;
  let lastSuccess = "";

  async function wikiFetch(event) {
    if(event) searchQuery = event.detail.query;
    if(searchQuery.toLowerCase() == lastSuccess.toLowerCase()) {
      return
    }
    freeze = true;
    searchError = false;
    splash.set("loader");

    let apiURL = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&origin=*&page=${searchQuery}&redirects`;

    const res = await fetch(apiURL, {
      mode: "cors",
    });
    let response = await res.json();

    if("error" in response) {
      searchError = true;
      splash.set({
        text: undefined,
      });
      freeze = false;
      return;
    }

    socket.emit("fetchedPage", $authStore.userID, { pageid: response.parse.pageid, title: response.parse.title });

    populateArticle(response);
  }

  async function ListenLinks() {
    document.querySelectorAll("#wikiContent a[href]").forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        let targetHref = event.currentTarget.getAttribute("href");

        if (!targetHref) return;
        if (event.currentTarget.classList.contains("external")) return;
        if (targetHref.includes(":")) {
          if (targetHref.match(/^.+?(:_).+?$/)) {
            searchQuery = decodeURI(targetHref).substring(6);
            wikiFetch();
          }
          return;
        }
        if (targetHref.substring(0, 3) === "/w/") return;
        if (targetHref.substring(0, 1) === "#") {
          document.getElementById(targetHref.substring(1)).scrollIntoView();
        }
        if (targetHref.substring(0, 6) === "/wiki/") {
          searchQuery = decodeURI(targetHref).substring(6);
          wikiFetch();
        }
      });
    })
  }

  async function populateArticle(response) {
    wikiContent.scrollTop = 0;
    
    wikiContent.innerHTML = response.parse.text["*"];

    lastSuccess = searchQuery;
    searchQuery = "";

    const addListeners = await ListenLinks(); // set links before removing the cover

    splash.set({
      text: undefined,
    });
    freeze = false;
  }

  function plantFlag(event) {
    socket.emit("plantFlag", $authStore.userID, event.detail.timer);
  }

  function roundReady() {
    socket.emit("roundReady", $authStore.userID);
  }

  function disconnectFromGame() {
    goto("/"); // socket disconnection is handled by beforeNavigate
  }

  let skipWiki;

  function handleKeydown(event) {
    if(event.key !== 'Escape') return;

    if($gameState.stage === "playing") {
      document.activeElement.blur();
      event.preventDefault();
      skipWiki.focus();
    } else if($gameState.stage === "planting" && lastSuccess) {
      document.activeElement.blur();
      event.preventDefault();
      skipWiki.focus();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
  <link rel="stylesheet" href="/style/wiki.min.css">

  {#if !$opponentData}
    {#if gameType === "public"}
      <title>Finding matchup - Wiki CTF</title>
    {:else}
      <title>Waiting for opponent - Wiki CTF</title>
    {/if}
  {:else}
    <title>VS {$opponentData.displayName} - Wiki CTF</title>
  {/if}
</svelte:head>

{#if $splash.text != undefined || $splash === "loader"}
  <Splash />
{/if}
{#if $gameState.stage == "roundend" || $gameState.stage == "gameend"}
  <Modal on:disconnect={disconnectFromGame} on:roundReady={roundReady} />
{/if}
{#if $gameState.stage == "playing"}
  <a href="#ControlsPanel" class="skipWiki" tabindex="0" rel=external bind:this={skipWiki}>SKIP ARTICLE</a>
{:else if $gameState.stage == "planting" && lastSuccess}
  <a href="#ControlsPanel" class="skipWiki" tabindex="0" rel=external bind:this={skipWiki}>SKIP ARTICLE</a>
{/if}
<article id="wikiContent" bind:this={wikiContent} tabindex="-1">

</article>
<aside class:backgroundGradient={$gameState["players"]?.length == 2} id="ControlsPanel">
  {#if gameType === "custom" && !$gameState.stage}
    <CustomGameView on:initCustomGame={initCustomGame} />
  {/if}
  {#if $opponentData}
    <Opponent on:click={disconnectFromGame} />
  {:else if $gameState.stage == "waiting"}
    <WaitingView {lobbyCode} {gameType} on:toaster={(event) => toast.set(event.detail)} on:cancelGame={disconnectFromGame} />
  {/if}
  {#if $gameState.stage == "planting"}
    <PlantingView {freeze} {lastSuccess} {searchError} {planted} on:search={wikiFetch} on:plant={plantFlag} />
  {:else if $gameState.stage == "playing" || $gameState.stage == "roundend" || $gameState.stage == "gameend"}
    <PlayingView />
  {/if}
  <SignInOut />
</aside>

<style>
  #wikiContent {
    grid-area: article;
    position: relative;
    z-index: -1;
    color: #000;
    overflow-y: scroll;
    scroll-behavior: smooth;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  a.skipWiki {
    position: absolute;
    top: 0; left: 50%;
    z-index: 150;
    transform: translate(-50%, -500px);
    padding: 0.25rem 1rem;
    border-radius: 3px;
    color: #fff;
    background: rgba(45, 46, 50, 90%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 25%);
    display: grid;
    place-items: center;
    text-align: center;
    font-weight: 600;
    font-size: Clamp(0.75rem, var(--font-size), 0.9rem);
    text-decoration: none;
  }
  a.skipWiki:focus {
    outline: solid 2px yellow;
    transform: translate(-50%, 0);
  }

  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 95px 1fr 95px;
    grid-template-areas:
      "opponent"
      "content"
      "user";
    background: var(--red-hsl);
    box-shadow: 0 0 5px rgba(0, 0, 0, 50%);
  }
  aside.backgroundGradient {
    background: linear-gradient(to bottom, var(--blue-hsl) 50%, var(--red-hsl) 0%);
  }
</style>