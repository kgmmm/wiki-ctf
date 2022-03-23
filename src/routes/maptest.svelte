<script>
  import Map from "$lib/components/Map.svelte";
  import { mapData } from "$lib/stores/mapData";
  import dataSamples from "$lib/mapTestData";

  function setMapData(data) {
    mapData.set(data);
  }
</script>

<div class="container">
  <Map />
</div>

<div class="buttons">
  <button on:click={() => setMapData(dataSamples.small)}>small</button>
  <button on:click={() => setMapData(dataSamples.medium)}>medium</button>
  <button on:click={() => setMapData(dataSamples.large)}>large</button>
</div>

<style>
  div.container {
    width: 330px;
    height: 330px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 200px #000;
  }
  div.buttons {
    position: fixed;
    bottom: 200px;
    left: 100px;
  }
</style>