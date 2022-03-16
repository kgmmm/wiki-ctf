<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let roundTime = 3;
  $: msTime = roundTime * 60000;
  let scoreLimit = 3;

  function initCustomGame() {
    dispatch("initCustomGame", {
      roundTime: msTime,
      scoreLimit: scoreLimit
    });
  }
</script>

<div>
  <form on:submit|preventDefault>
    <p>Round time: </p>
    <label for="three">
      <input type="radio" bind:group={roundTime} id="three" value={3} name="roundTime" checked> 3 minutes
    </label>
      <br>
    <label for="six">
      <input type="radio" bind:group={roundTime} id="six" value={6} name="roundTime"> 6 minutes
    </label>
      <br>
    <label for="ten">
      <input type="radio" bind:group={roundTime} id="nine" value={9} name="roundTime"> 9 minutes
    </label>
    <p>Score limit: </p>
    <label for="scoreLimit">
      First to <input type="number" min="3" max="15" bind:value={scoreLimit}>
    </label>
    <button class="startBtn" on:click={initCustomGame}>Start game</button>
  </form>
</div>

<style>
  div {
    grid-area: content;
    place-self: center;
  }

  button.startBtn {
    margin-bottom: 15px;
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
  }
  button.startBtn:hover {
    background: var(--blue-light-5);
  }
</style>