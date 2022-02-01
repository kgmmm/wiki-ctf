<script>
  console.log("layout loaded");
</script>

<main>
  <slot/>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 400px;
    grid-template-rows: 100%;
    overflow: hidden;
  }
</style>