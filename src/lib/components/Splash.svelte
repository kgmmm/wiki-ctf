<script>
  import Loader from "$lib/components/Loader.svelte";
  import { splash } from "$lib/stores/splash";
  import { scale, fade } from "svelte/transition";
</script>

<div class="overlay" in:fade={{duration: 100}}>
  {#if $splash === "loader"}
      <Loader size="80" />
  {:else if $splash.text}
    {#if $splash.text == "GO"}
      <h1 class="splashText" in:scale={{start: 1.5, duration: 200}} out:scale={{duration: 200}}>{$splash.text}</h1>
    {:else}
      <h1 class="splashText" in:scale={{start: 1.5, duration: 200}}>{$splash.text}</h1>
    {/if}
  {/if}
</div>

<style>
  div.overlay {
    background: rgba(0, 0, 0, 25%);
    position: fixed;
    inset: 0;
    right: 400px;
    z-index: 799;
    display: grid;
    place-items: center;
    isolation: isolate;
    overflow: hidden;
  }

  h1.splashText {
    color: var(--red);
    font-size: 12rem; /* TODO: use clamp for fontsize that changes depending on how many characters (might be useful elsewhere) min 6.5 max 12 */
    user-select: none;
  }
</style>