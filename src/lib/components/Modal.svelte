<script>
  export let gameState;

  let winner;

  $: if(gameState.stage == "gameend") {
    winner = gameState["players"].find(player => player.score >= 3);
  }
</script>

<div class="container">
  {#if gameState.stage == "roundend"}
    <h1>roundend</h1>
  {:else if gameState.stage == "gameend"}
    <h1>gameend</h1>
  {/if}
</div>
<div class="shadow"></div>

<style>
  div.shadow {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 25%);
    z-index: 799;
  }

  div.container {
    width: 500px;
    height: 380px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 20%);
  }
</style>