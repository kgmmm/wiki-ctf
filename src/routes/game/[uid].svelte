<script>
  import { goto } from "$app/navigation";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount, tick } from "svelte";
  import SignInOut from "$lib/components/SignInOut.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Opponent from "$lib/components/Opponent.svelte";

  onMount(async () => {
    await tick();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) return;
      goto("/", { replaceState: true, noscroll: false, keepfocus: false, state: {} });
    });
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
      console.log("same request as before");
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

    console.log(response);

    if("error" in response) {
      searchError = true;
      loading = false;
      inputDisabled = false;
      console.timeEnd("roundtrip"); // LOG
      return;
    } else {
      searchError = false;
    }

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
    
    returnedTitle = response.parse.title;
    wikiContent.innerHTML = response.parse.text["*"];

    console.timeEnd("roundtrip"); // LOG

    lastSuccess = searchInput;
    searchInput = "";

    const addListeners = await ListenLinks(); // set links before removing the cover

    loading = false;
    inputDisabled = false;
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
  <Opponent />
  <div class="temp">
    <div class="title">
      <h3>{returnedTitle}</h3>
    </div>
    <form on:submit|preventDefault={wikiFetch}>
      <input type="text" bind:value={searchInput} disabled={inputDisabled}>
      {#if searchError}
        <span class="searchError">Try something else</span>
      {/if}
    </form>
  </div>
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