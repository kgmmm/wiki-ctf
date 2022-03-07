<script>
  import Loader from "$lib/components/Loader.svelte";
  import { splash } from "$lib/stores/splash";
  import { scale, fade } from "svelte/transition";

  let size;

  $: if($splash.text != undefined) {
    size = 11 - $splash["text"].length / 2 + "rem";
  }
</script>

<div class="overlay" in:fade={{duration: 100}}>
  {#if $splash === "loader"}
      <Loader size="80" />
  {:else if $splash.text}
    {#if $splash.text == "GO"}
      <h1 class="splashText" style="font-size: clamp(6rem, {size}, 12rem);" in:scale={{start: 1.5, duration: 200}} out:scale={{duration: 200}}>{$splash.text}</h1>
    {:else}
      <h1 class="splashText" style="font-size: clamp(6rem, {size}, 12rem);" in:scale={{start: 1.5, duration: 200}}>{$splash.text}</h1>
    {/if}
  {/if}
</div>

<style>
  div.overlay {
    background: rgba(0, 0, 0, 25%);
    position: fixed;
    inset: 0;
    right: 400px;
    z-index: 699;
    display: grid;
    place-items: center;
    isolation: isolate;
    overflow: hidden;
  }

  h1.splashText {
    color: var(--red-hsl);
    user-select: none;
  }
</style>