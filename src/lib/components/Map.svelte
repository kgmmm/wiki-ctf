<script>
  import { Svroller } from "svrollbar";
  import { mapData } from "$lib/stores";
  import MapIcon from "$lib/components/MapIcon.svelte";

  export let result;
</script>

<Svroller width="330px" height="330px">
  <ul class="map" tabindex="-1">
    {#if $mapData?.length > 0}
      {#each $mapData as stop, i}
        {@const lastData = $mapData[i - 1]}
        {#if i === 0}
          <li class="me stop">
            <MapIcon type="flag" text={stop[0]} />
          </li>
          <li class="opponent stop">
            <MapIcon type="flag" text={stop[1]} />
          </li>
        {:else if i == $mapData.length - 1}
          <li class="me stop" class:carrying={stop[2] === 1 || stop[2] === 3}>
            <MapIcon text={stop[0]} type={result[1] === 1 ? "trophy" : "flag"} />
          </li>
          <li class="opponent stop" class:carrying={stop[2] === 2 || stop[2] === 3}>
            <MapIcon text={stop[1]} type={result[1] === 0 ? "trophy" : "flag"} />
          </li>
        {:else}
          {#if stop[0] !== lastData[0] || stop[1] !== lastData[1]}
            {#if stop[0] === stop[1]}
              <li class="joint">
                <MapIcon joint text={stop[0]} />
              </li>
            {:else}
              {#if stop[0] !== lastData[0] && stop[1] !== lastData[1]}
                <li class="me stop" class:carrying={stop[2] === 1 || stop[2] === 3}>
                  <MapIcon text={stop[0]} />
                </li>
                <li class="opponent stop" class:carrying={stop[2] === 2 || stop[2] === 3}>
                  <MapIcon text={stop[1]} />
                </li>
              {:else if stop[0] !== lastData[0]}
                <li class="me stop" class:carrying={stop[2] === 1 || stop[2] === 3}>
                  <MapIcon text={stop[0]} />
                </li>
                <li class="blank opponent" class:carrying={stop[2] === 2 || stop[2] === 3}> </li>
              {:else if stop[1] !== lastData[1]}
                <li class="blank me" class:carrying={stop[2] === 1 || stop[2] === 3}> </li>
                <li class="opponent stop" class:carrying={stop[2] === 2 || stop[2] === 3}>
                  <MapIcon text={stop[1]} />
                </li>
              {/if}
            {/if}
          {:else}
            <li class="blank me" class:carrying={stop[2] === 1 || stop[2] === 3}> </li>
            <li class="blank opponent" class:carrying={stop[2] === 2 || stop[2] === 3}> </li>
          {/if}
        {/if}
      {/each}
    {/if}
  </ul>
</Svroller>

<style>
  ul.map {
    padding: 2rem 0;
    width: 100%;
    height: 100%;
    color: #000;
    display: flex;
    flex-flow: wrap;
    list-style-type: none;
    text-align: center;
    isolation: isolate;
  }

  li {
    width: 50%;
    display: grid;
    place-items: center;
    position: relative;
  }
  li::before {
    content: '';
    width: 10px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent);
    border-left: solid 2px var(--accent-2);
    border-right: solid 2px var(--accent-2);
    z-index: -1;
  }

  li:nth-child(1)::before, li:nth-child(2)::before {
    height: 50% !important;
    top: 50% !important;
  }
  li:last-child::before, li:nth-last-child(2)::before {
    height: 50% !important;
    top: 0 !important;
  }

  li.blank {
    min-height: 1px;
  }
  li.me {
    --accent: var(--red-hsl);
    --accent-2: var(--red-dark-15);
    --trophy-accent: var(--red-hsl);
  }
  li.opponent {
    --accent: var(--blue-hsl);
    --accent-2: var(--blue-dark-15);
    --trophy-accent: var(--blue-hsl);
  }

  li.stop {
    min-height: 2.5rem;
  }
  li.blank::before {
    height: calc(100% + calc(2.5rem / 2));
    top: unset;
  }

  li.joint {
    width: 100%;
    min-height: 2.5rem;
    --accent: #d5d7da;
    --accent-2: #b9bbbe;
  }
  li.joint::before, li.joint::after {
    content: '';
    width: 10px;
    height: 100%;
    background: var(--accent);
    border-left: solid 2px var(--accent-2);
    border-right: solid 2px var(--accent-2);
    position: absolute;
    top: 0;
    left: 25%;
    transform: translateX(-50%);
    z-index: 0;
  }
  li.joint::after {
    left: 75%;
  }

  .carrying {
    --accent: yellow !important;
    --accent-2: #dddd00 !important;
  }
</style>