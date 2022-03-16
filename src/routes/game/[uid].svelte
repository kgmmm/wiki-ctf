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
  import { authStore } from "$lib/stores/authStore";
  import { toast } from "$lib/stores/toast";
  import { splash } from "$lib/stores/splash";
  import Splash from "$lib/components/Splash.svelte";
  import Modal from "$lib/components/Modal.svelte";

  export let lobbyCode;
  export let gameType;

  let socket;
  let gameState = {};
  let opponentData;
  let opponentProps;
  let myData;
  let planted;

  let backgroundGradient;

  $: {
    if (gameState.players && gameState["players"].length > 1) {
      backgroundGradient = gameState["players"].length == 2;

      opponentData = gameState.players.find(player => player.id !== $authStore.userID);
      opponentProps = {
        userID: opponentData.id,
        displayName: opponentData.displayName,
        profilePic: opponentData.profilePic,
      }
      myData = gameState.players.find(player => player.id === $authStore.userID);
      planted = myData.planted;
    }
  }

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

    socket = io("ws://localhost:5000");

    if(gameType !== "custom") {
      const initializeGame = authStore.subscribe(data => {
        if(data.isLoggedIn) {
          socket.emit("initGame", lobbyCode, { userID: $authStore.userID, displayName: $authStore.displayName, profilePic: $authStore.profilePic, }, gameType);
        }
      });
    }

    socket.on("gameStateUpdate", (newState) => {
      console.log(newState); // LOG
      gameState = newState;
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
      console.log("same request as before"); // LOG
      return
    }
    console.time("roundtrip"); // LOG
    freeze = true;
    searchError = false;
    splash.set("loader");

    let apiURL = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&origin=*&page=${searchQuery}&redirects`;

    const res = await fetch(apiURL, {
      mode: "cors",
    });
    let response = await res.json();

    console.log(response); // LOG

    if("error" in response) {
      searchError = true;
      splash.set({
        text: undefined,
      });
      freeze = false;
      console.timeEnd("roundtrip"); // LOG
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

    console.timeEnd("roundtrip"); // LOG

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
</script>

<svelte:head>
  <link rel="stylesheet" href="/style/wiki.css">

  {#if !opponentProps}
    {#if gameType === "public"}
      <title>Finding matchup - Wiki CTF</title>
    {:else}
      <title>Waiting for opponent - Wiki CTF</title>
    {/if}
  {:else}
    <title>VS {opponentProps.displayName} - Wiki CTF</title>
  {/if}
</svelte:head>

{#if $splash.text != undefined || $splash === "loader"}
  <Splash />
{/if}
{#if gameState.stage == "roundend" || gameState.stage == "gameend"}
  <Modal {gameState} {myData} on:disconnect={disconnectFromGame} on:roundReady={roundReady} />
{/if}
<article id="wikiContent" bind:this={wikiContent} tabindex="-1">

</article>
<aside class:backgroundGradient>
  {#if gameType === "custom" && !gameState.stage}
    <CustomGameView on:initCustomGame={initCustomGame} />
  {/if}
  {#if opponentProps}
    <Opponent on:click={disconnectFromGame} {...opponentProps} />
  {:else if gameState.stage == "waiting"}
    <WaitingView {lobbyCode} {gameType} on:toaster={(event) => toast.set(event.detail)} on:cancelGame={disconnectFromGame} />
  {/if}
  {#if gameState.stage == "planting"}
    <PlantingView {freeze} {lastSuccess} {searchError} {planted} {myData} on:search={wikiFetch} on:plant={plantFlag} />
  {:else if gameState.stage == "playing" || gameState.stage == "roundend" || gameState.stage == "gameend"}
    <PlayingView {gameState} {opponentData} {myData} />
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

  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 100px 1fr 100px;
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