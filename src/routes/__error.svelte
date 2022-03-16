<script context="module">
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ error, status }) {
    return {
      props: {
        statusCode: status,
        errorMsg: error.message,
      }
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";

  export let statusCode;
  export let errorMsg;

  function goDrunkYoureHome() {
    goto("/");
  }
</script>

<svelte:head>
  <title>{statusCode} - Wiki CTF</title>
</svelte:head>

<article>
  <div class="col-1" in:fly={{ x: -100, duration: 400 }} out:fly={{ x: -500, duration: 200 }}>
    <h1 in:fly={{ x: -50, duration: 300, delay: 200}}>{statusCode}</h1>
  </div>
  <div class="col-2">
    <div class="content" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 150 }}>
      <h2>{statusCode}</h2>
      <p>{errorMsg}</p>
    </div>
  </div>
</article>
<aside>
  {#if statusCode === 404}
    <h3>You took a wrong turn...</h3>
  {:else if statusCode === 500}
    <h3>Somethings wrong on our end<br>give us a minute.</h3>
  {:else}
    <h3>Oopsie, we'll fix that.</h3>
  {/if}
  <button on:click={goDrunkYoureHome}>Back home</button>
</aside>

<style>
  aside {
    grid-area: aside;
    background: var(--red-hsl);
    box-shadow: 0 0 5px rgba(0, 0, 0, 50%);
    display: grid;
    place-content: center;
    text-align: center;
  }

  aside button {
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
    place-self: center;
  }
  aside button:hover {
    background: var(--blue-light-5);
  }

  aside h3 {
    margin-block: 1.25rem;
    font-size: 1.3rem;
  }

  article {
    grid-area: article;
    display: grid;
    grid-template-columns: 1fr 760px;
    z-index: -1;
  }

  div.col-1 {
    background: var(--red-hsl);
    display: grid;
    align-items: center;
    justify-content: right;
    text-align: right;
    box-shadow: 0 0 5px rgba(0, 0, 0, 50%);
  }

  div.col-1 h1 {
    margin: 1rem;
    max-width: min-content;
    font-size: 8rem;
    color: #fff;
    line-height: 90%;
    text-transform: uppercase;
    position: relative;
  }
  div.col-1 h1::before {
    content: 'error';
    width: max-content;
    height: 0;
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1;
    color: #fff;
  }

  div.col-2 {
    display: grid;
    place-items: center;
  }

  div.content {
    --margin: 1.5rem;
    margin: var(--margin);
    padding: 1.5rem 2rem;
    font-size: 1rem;
    line-height: 150%;
    width: calc(100% - calc(2 * var(--margin)));
    color: #222222;
    background: white;
    border-radius: 3px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
    position: relative;
  }
  div.content p {
    line-height: 1.6;
  }
  div.content h2 {
    font-family: "Linux Libertine", "Georgia", "Times", serif;
    font-size: 1.8rem;
    line-height: 1.3;
    margin-bottom: 0.25rem;
    font-weight: normal;
    border-bottom: 1px solid #a2a9b1;
  }

  @media screen and (max-width: 1560px) {
    div.col-1 h1 {
      display: none;
    }
  }

  @media screen and (max-width: 1160px) {
    article {
      grid-template-columns: Clamp(500px, 100%, 100%);
    }

    div.col-1 {
      display: none;
    }
  }
</style>