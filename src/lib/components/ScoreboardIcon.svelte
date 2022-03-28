<script>
  import { fade } from "svelte/transition";
  import { createPopperActions } from "svelte-popperjs";

  const [popperRef, popperContent] = createPopperActions();

  const popperOptions = {
    placement: "top",
    strategy: 'fixed',
  };

  export let type;
  export let area;
  export let active;

  let showToolTip = false;
</script>

<span use:popperRef style={`grid-area: ${area};`} class:active
      on:mouseenter={() => { if(active) showToolTip = true; }}
      on:mouseleave={() => { showToolTip = false; }}>
  {#if type === "flag"}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
      <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
    </svg>
  {:else if type === "location"}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  {/if}
</span>

{#if showToolTip}
  <div use:popperContent={popperOptions} class="display"
       in:fade={{ duration: 100 }}
       out:fade={{ duration: 100 }}>
    {#if type === "flag" && area === "mBase"}
      Your flag has been taken!
    {:else if type === "flag" && area === "oBase"}
      You have taken your opponents flag!
    {/if}
  </div>
{/if}

<style>
  .active {
    box-shadow: 0 0 10px yellow;
    animation: active .5s infinite alternate-reverse;
    position: relative;
    z-index: 1;
  }

  @keyframes active {
    from {
      box-shadow: 0 0 5px yellow;
    }
    to {
      box-shadow: 0 0 10px yellow;
    }
  }

  span {
    width: 100%;
    height: 100%;
    color: #fff;
    background: rgba(0, 0, 0, 10%);
    border: solid 1px rgba(0, 0, 0, 15%);
    border-radius: 5px;
    display: grid;
    place-items: center;
    position: relative;
  }
  span svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    font-size: 1.2rem;
  }

  div.display {
    width: 100%;
    max-width: 150px;
    padding: 0.3rem;
    border-radius: 3px;
    color: #222;
    background: rgba(255, 255, 255, 90%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 25%);
    display: grid;
    place-items: center;
    text-align: center;
    z-index: 150;
    font-family: "Lato", sans-serif;
    line-height: 1;
    font-weight: 600;
    font-size: 0.75rem;
  }
  div.display::after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
    border: solid 5px transparent;
    border-left: solid 10px transparent;
    border-right: solid 10px transparent;
    border-top-color: rgba(255, 255, 255, 90%);
    pointer-events: none;
  }
</style>