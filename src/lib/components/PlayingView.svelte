<script>
  import { onMount } from "svelte";
  import { splash } from "$lib/stores";
  import ScoreboardIcon from "./ScoreboardIcon.svelte";
  import { gameState, myData, opponentData } from "$lib/stores";


  function calcTime(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = ((time % 60000) / 1000).toFixed(0);
    return (
      seconds == 60 ?
      ("0" + minutes + 1) + ":00" :
      "0" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
  }

  $: roundTime = calcTime($gameState.currentTime);

  onMount(() => {
    splash.set({
      text: "GO",
    });

    const removeSplash = setTimeout(() => {
      splash.set({
        text: undefined,
      });
    }, 1500);

    return () => {
      clearInterval(removeSplash);
    }
  });
</script>

<div class="container">
  <div class="opponent">
    <div class="oBase">
      <div class="title">
        opponent's base
      </div>
      <div class="display">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
          </svg>
        </div>
        <h1 style="font-size: Clamp(0.75rem, {310 / $opponentData['base'].length / 8 + 'rem'}, 1.2rem);">{$opponentData.base}</h1>
      </div>
    </div>
    <div class="oLoc">
      <div class="title">
        opponent's location
      </div>
      <div class="display">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
        </div>
        <h1 style="font-size: Clamp(0.75rem, {310 / $opponentData['location'].length / 8 + 'rem'}, 1.2rem);">{$opponentData.location}</h1>
      </div>
    </div>
  </div>

  <div class="scoreboard">
    <div class="myScore">
      {$myData.score}
    </div>
    <ScoreboardIcon area="mBase" type="flag" active={$opponentData.carrying} />
    <ScoreboardIcon area="mLoc" type="location" active={false} />
    <div class="timer">
      {roundTime}
    </div>
    <ScoreboardIcon area="oLoc" type="location" active={false} />
    <ScoreboardIcon area="oBase" type="flag" active={$myData.carrying} />
    <div class="opponentScore">
      {$opponentData.score}
    </div>
  </div>

  <div class="me">
    <div class="mLoc">
      <div class="title">
        your location
      </div>
      <div class="display">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
        </div>
        <h1 style="font-size: Clamp(0.75rem, {310 / $myData['location'].length / 8 + 'rem'}, 1.2rem);">{$myData.location}</h1>
      </div>
    </div>
    <div class="mBase">
      <div class="title">
        your base
      </div>
      <div class="display">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
          </svg>
        </div>
        <h1 style="font-size: Clamp(0.75rem, {310 / $myData['base'].length / 8 + 'rem'}, 1.2rem);">{$myData.base}</h1>
      </div>
    </div>
  </div>
</div>

<style>
  div.container {
    grid-area: content;
    display: grid;
    grid-template-rows: 1fr 89px 1fr;
  }

  div.opponent, div.me, div.scoreboard, div.timer, div.opponentScore, div.myScore {
    display: grid;
    place-items: center;
    text-align: center;
  }

  div.opponent, div.me {
    padding: 7px;
    grid-template-rows: max-content max-content;
    gap: 7px;
    align-content: end;
  }
  div.me {
    align-content: start;
  }

  div.oBase, div.oLoc, div.mBase, div.mLoc {
    width: 100%;
    display: grid;
    grid-template-rows: 1.5rem 1fr;
  }

  div.opponent div.title {
    text-align: left;
  }
  div.opponent div.display {
    padding-left: 1rem;
    grid-template-areas: "text icon";
    grid-template-columns: 1fr 3.5rem;
  }
  div.opponent div.display h1 {
    justify-self: right;
  }

  div.me div.title {
    text-align: right;
  }
  div.me div.display {
    padding-right: 1rem;
    grid-template-areas: "icon text";
    grid-template-columns: 3.5rem 1fr;
  }
  div.me div.display h1 {
    justify-self: left;
  }

  div.title {
    padding: 0 0.5rem;
    display: grid;
    align-items: center;
    background: var(--blue-dark-5);
    text-transform: uppercase;
    font-size: 0.7rem;
    font-family: 'Courier New', Courier, monospace;
    color: rgba(255, 255, 255, 75%);
    border: solid 1px var(--blue-dark-10);
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    user-select: none;
  }
  div.me div.title {
    background: var(--red-dark-5);
    border: solid 1px var(--red-dark-10);
    border-bottom: none;
  }

  div.display {
    min-height: 3.5rem;
    display: grid;
    place-items: center;
    gap: 7px;
    background: var(--blue-light-5);
    border: solid 1px var(--blue-dark-10);
    border-top: none;
    border-radius: 0 0 5px 5px;
  }
  div.me div.display {
    background: var(--red-light-5);
    border: solid 1px var(--red-dark-10);
    border-top: none;
  }
  div.display div.icon {
    width: 75%;
    height: 75%;
    grid-area: icon;
    display: grid;
    place-items: center;
    border-radius: 5px;
    background: var(--blue-hsl);
  }
  div.me div.icon {
    background: var(--red-hsl);
  }
  div.icon svg {
    width: 1em;
    height: 1em;
    font-size: 1.3rem;
    fill: #fff;
  }

  div.display h1 {
    margin-block: 0.4rem;
    grid-area: text;
    font-size: 1.2rem;
    line-height: 90%;
  }

  div.scoreboard {
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    background: linear-gradient(240deg, var(--blue-hsl) 50%, var(--red-hsl) 0%);
    padding: 7px;
    grid-template-columns: 75px 33px 1fr 33px 75px;
    grid-template-rows: 1fr 1fr;
    gap: 7px;
    grid-template-areas:
      "mScore mLoc timer oBase oScore"
      "mScore mBase timer oLoc oScore";
  }

  div.timer, div.opponentScore, div.myScore {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 10%);
    border: solid 1px rgba(0, 0, 0, 15%);
    border-radius: 5px;
  }

  div.myScore, div.opponentScore {
    grid-area: mScore;
    border-radius: 5px;
    font-size: 1.5rem;
    position: relative;
  }
  div.opponentScore {
    grid-area: oScore;
  }
  div.opponentScore::after, div.myScore::after {
    content: "points";
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #fff;
    opacity: 75%;
  }

  div.timer {
    grid-area: timer;
    font-size: 1.5rem;
  }
</style>