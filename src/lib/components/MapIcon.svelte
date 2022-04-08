<script>
  import { fade } from "svelte/transition";
  import { createPopperActions } from "svelte-popperjs";

  const [popperRef, popperContent] = createPopperActions();

  const popperOptions = {
    placement: "top",
    strategy: 'fixed',
  };

  export let type = "location";
  export let joint = false;
  export let text;

  let showToolTip = false;
  let focussed = false;
  let linkClick = false;
</script>

<div use:popperRef class="icon" class:joint class:trophy={type === "trophy"} tabindex="0"
     on:mouseenter={() => { if(!focussed) showToolTip = true; }}
     on:mouseleave={() => { if(!focussed) showToolTip = false; }}
     on:focus={() => { focussed = true; showToolTip = true; }}
     on:blur={() => { focussed = false; showToolTip = false; linkClick = false; }}
     on:click={() => { linkClick = true; }}>
  {#if type == "flag"}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
      <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
    </svg>
  {:else if type == "location"}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  {:else if type == "trophy"}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trophy-fill" viewBox="0 0 16 16">
      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
    </svg>
  {/if}
</div>
{#if showToolTip}
  <div use:popperContent={popperOptions} class="display" style:--font-size={135 / text.length / 8 + 'rem'}
       in:fade={{ duration: 100 }}
       out:fade={{ duration: 100 }}>
    {#if linkClick}
      <a href={`https://en.wikipedia.org/wiki/${text}`} target="_blank" rel="external">{text}</a>
    {:else}
      {text}
    {/if}
  </div>
{/if}

<style>
  div.icon {
    margin-block: 0.25rem;
    width: 1.6rem;
    height: 1.6rem;
    color: rgba(0, 0, 0, 50%);
    background: #fff;
    border: solid 1px rgba(0, 0, 0, 50%);
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 25%);
    display: grid;
    place-items: center;
    z-index: 100;
  }
  div.icon:focus, div.icon:focus-within {
    outline: solid 2px yellow;
  }
  div.icon svg {
    width: 1em;
    height: 1em;
    font-size: 0.9rem;
    fill: currentColor;
  }

  div.icon.trophy {
    color: var(--trophy-accent);
    border: solid 1px var(--trophy-accent);
    box-shadow: 0 0 3px var(--trophy-accent);
  }

  div.icon:focus + div.display {
    display: grid;
    outline: solid 2px yellow;
  }

  div.display {
    width: 100%;
    max-width: 145px;
    padding: 0.25rem;
    border-radius: 3px;
    color: #fff;
    background: rgba(45, 46, 50, 90%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 25%);
    display: grid;
    place-items: center;
    text-align: center;
    z-index: 150;
    font-weight: 600;
    font-size: Clamp(0.75rem, var(--font-size), 0.9rem);
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
    border-top-color: rgba(45, 46, 50, 90%);
    pointer-events: none;
  }

  div.display a {
    color: #578fe9;
    text-decoration: underline;
  }
  div.display a:hover {
    color: #73a0e9;
  }
  div.display a:active {
    color: #faa700;
  }

  div.icon.joint {
    z-index: unset;
  }
  div.icon.joint::before {
    content: '';
    width: calc(50% - 6px);
    height: 10px;
    background: var(--accent);
    border-top: solid 2px var(--accent-2);
    border-bottom: solid 2px var(--accent-2);
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    transform: translate(-50%, -50%);
  }
</style>