<script>
  import { mapData } from "$lib/stores";
  import dataSamples from "$lib/mapTestData";
  import Modal from "$lib/components/Modal.svelte";
  
  let gameState = {
      "lobbyCode": "0YL6KUBRLm9kw1YQ5X0ge0hzD4nl",
      "stage": "roundend",
      "currentTime": 170000,
      "gameVARS": [
          180000,
          3
      ],
      "players": [
          {
              "id": "CQcn4Ra7Y9MgpyaEZkx0jlseHoo2",
              "planted": true,
              "score": 0,
              "location": "Joe Biden",
              "base": "Joe Biden",
              "carrying": false,
              "displayName": "Kieran May",
              "profilePic": "https://lh3.googleusercontent.com/a/AATXAJx0WLtNAxfQJQBcey2O013wPpp05vpHvCeLUFev=s96-c",
              "roundReady": false
          },
          {
              "id": "w1xTpWSZ4Lem5PxOqqQAIpoFLEi2",
              "planted": true,
              "score": 1,
              "location": "Donald Trump",
              "base": "Donald Trump",
              "carrying": false,
              "displayName": "Kieran May",
              "profilePic": "https://lh3.googleusercontent.com/a-/AOh14GhiusvUPNrUnrP44UdepTW0CLagUjpVJAcV6mP2=s96-c",
              "roundReady": false
          }
      ],
      "lastRoundResult": "w1xTpWSZ4Lem5PxOqqQAIpoFLEi2",
      "gameType": "public"
    }

  let myData = {
              "id": "w1xTpWSZ4Lem5PxOqqQAIpoFLEi2",
              "planted": true,
              "score": 1,
              "location": "Donald Trump",
              "base": "Donald Trump",
              "carrying": false,
              "displayName": "Kieran May",
              "profilePic": "https://lh3.googleusercontent.com/a-/AOh14GhiusvUPNrUnrP44UdepTW0CLagUjpVJAcV6mP2=s96-c",
              "roundReady": false
          };
  let opponentData = {
              "id": "CQcn4Ra7Y9MgpyaEZkx0jlseHoo2",
              "planted": true,
              "score": 0,
              "location": "Joe Biden",
              "base": "Joe Biden",
              "carrying": false,
              "displayName": "Kieran May",
              "profilePic": "https://lh3.googleusercontent.com/a/AATXAJx0WLtNAxfQJQBcey2O013wPpp05vpHvCeLUFev=s96-c",
              "roundReady": false
          };

  function setMapData(data) {
    mapData.set(data);
  }
</script>

<div class="container">
  <Modal {gameState} {myData} {opponentData} />
</div>

<div class="buttons">
  <button on:click={() => setMapData(dataSamples.small)}>small</button>
  <button on:click={() => setMapData(dataSamples.medium)}>medium</button>
  <button on:click={setMapData(dataSamples.large)}>large</button>
</div>

<style>
  div.container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    place-items: center;
  }

  div.buttons {
    position: fixed;
    bottom: 20px;
    left: 20;
  }
</style>