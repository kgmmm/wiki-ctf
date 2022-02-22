<script>
  import Loader from "$lib/components/Loader.svelte";
  import { splash } from "$lib/stores/splash";
  import { scale, fade } from "svelte/transition";
</script>

<div class="overlay" in:fade={{duration: 100}}>
  {#if $splash === "loader"}
      <Loader size="80" />
  {:else if $splash.text}
      <h1 class="splashText" in:scale={{start: 1.5, duration: 200}} out:scale={{duration: 200}}>{$splash.text}</h1>
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
  }

  h1.splashText {
    color: var(--red);
    font-size: 12rem;
    user-select: none;
  }
</style>