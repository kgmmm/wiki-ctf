<script>
  import { fly } from "svelte/transition";
  import { toast } from "$lib/stores";
  import { onDestroy } from "svelte";

  export let title;
  export let message;

  let toastTimeout;

  const clearToast = toast.subscribe(data => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.set({
        title: undefined,
        message: undefined,
      });
    }, 5000);
  });

  onDestroy(() => {
    clearToast;
    clearTimeout(toastTimeout);
    toast.set({
      title: undefined,
      message: undefined,
    });
  });
</script>

<div in:fly={{y: 80, duration: 300}} out:fly={{y: -200, duration: 400}}>
  <h4>{title}</h4>
  <p>{message}</p>
  <button title="Dismiss" on:click={() => toast.set({ title: undefined, message: undefined, })}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
    </svg>
  </button>
</div>

<style>
  div {
    padding: 0.5rem;
    width: 350px;
    height: 80px;
    display: grid;
    grid-template-rows: 20px 1fr;
    grid-template-columns: 1fr 20px;
    grid-template-areas: "h b"
      "t .";
    color: #fff;
    background: var(--blue-hsl);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    position: fixed;
    bottom: 15px;
    left: 15px;
    z-index: 899;
  }

  h4 {
    grid-area: h;
    font-size: 0.8rem;
    font-weight: 300;
    align-self: center;
  }

  p {
    grid-area: t;
    font-size: 0.95rem;
    align-self: top;
  }

  button {
    grid-area: b;
    cursor: pointer;
    display: grid;
    place-items: center;
    color: #fff;
    background: transparent;
    border: none;
    border-radius: 3px;
  }
  button:hover {
    background: rgba(255, 255, 255, 15%);
  }
  
  button svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    font-size: 1rem;
  }
</style>