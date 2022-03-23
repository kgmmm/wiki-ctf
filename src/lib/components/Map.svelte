<script>
  import { mapData } from "$lib/stores/mapData";
  import MapIcon from "$lib/components/MapIcon.svelte";

  let mapNode;
</script>

<ul class="map" bind:this={mapNode} tabindex="-1">
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
      {:else}
        {#if stop[0] !== lastData[0] || stop[1] !== lastData[1]}
          {#if stop[0] === stop[1]}
            <li class="joint">
              <MapIcon joint text={stop[0]} />
            </li>
          {:else}
            {#if stop[0] === lastData[0]}
              {#if stop[2] === 1}
                <li class="blank carrying"> </li>
                <li class="opponent stop">
                  <MapIcon text={stop[1]} />
                </li>
              {:else if stop[2] === 2}
                <li class="blank me"> </li>
                <li class="opponent carrying stop">
                  <MapIcon text={stop[1]} />
                </li>
              {:else if stop[2] === 3}
                <li class="blank carrying"> </li>
                <li class="carrying stop">
                  <MapIcon text={stop[1]} />
                </li>
              {:else}
                <li class="blank me"> </li>
                <li class="opponent stop">
                  <MapIcon text={stop[1]} />
                </li>
              {/if}
            {:else if stop[1] === lastData[1]}
              {#if stop[2] === 1}
                <li class="me carrying stop">
                  <MapIcon text={stop[0]} />
                </li>
                <li class="blank opponent"> </li>
              {:else if stop[2] === 2}
                <li class="me stop">
                  <MapIcon text={stop[0]} />
                </li>
                <li class="blank carrying"> </li>
              {:else if stop[2] === 3}
                <li class="carrying stop">
                  <MapIcon text={stop[0]} />
                </li>
                <li class="blank carrying"> </li>
              {:else}
                <li class="me stop">
                  <MapIcon text={stop[0]} />
                </li>
                <li class="blank opponent"> </li>
              {/if}
            {/if}
          {/if}
        {:else}
          {#if stop[2] === 1}
            <li class="blank carrying"> </li>
            <li class="blank opponent"> </li>
          {:else if stop[2] === 2}
            <li class="blank me"> </li>
            <li class="blank carrying"> </li>
          {:else if stop[2] === 3}
            <li class="blank carrying"> </li>
            <li class="blank carrying"> </li>
          {:else}
            <li class="blank me"> </li>
            <li class="blank opponent"> </li>
          {/if}
        {/if}
      {/if}
    {/each}
  {/if}
</ul>

<style>
  ul.map {
    padding: 2rem 1rem;
    width: 100%;
    height: 100%;
    color: #000;
    background: var(--wiki-chrome-bg-color);
    border-radius: 5px;
    display: flex;
    flex-flow: wrap;
    list-style-type: none;
    text-align: center;
    isolation: isolate;
    scroll-behavior: smooth;
    overflow-y: auto;
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
    bottom: unset !important;
  }
  li:last-child::before, li:nth-last-child(2)::before {
    height: 50% !important;
    top: 0 !important;
    bottom: unset !important;
  }

  li.blank {
    min-height: 1px;
  }
  li.me {
    --accent: var(--red-hsl);
    --accent-2: var(--red-dark-15);
  }
  li.opponent {
    --accent: var(--blue-hsl);
    --accent-2: var(--blue-dark-15);
  }

  li.stop {
    min-height: 2.5rem;
  }
  li.stop ~ li.blank.carrying::before {
    height: calc(100% + calc(2.5rem / 2));
    top: unset;
    bottom: 0;
  }
  li.stop + li.blank.carrying::before {
    height: auto;
    top: 0;
  }

  li.joint {
    width: 100%;
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