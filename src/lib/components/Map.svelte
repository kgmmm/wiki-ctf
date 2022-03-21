<script>
  import { mapData } from "$lib/stores/mapData";
</script>

<ul class="map">
  {#if $mapData?.length > 0}
    {#each $mapData as stop, i}
      {@const lastData = $mapData[i - 1]}
      {#if i === 0}
        <li class="me">
          <div class="icon" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
              <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
            </svg>
          </div>
          <div class="display">{stop[0]}</div>
        </li>
        <li class="opponent">
          <div class="icon" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
              <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
            </svg>
          </div>
          <div class="display">{stop[1]}</div>
        </li>
      {:else}
        {#if stop[0] !== lastData[0] || stop[1] !== lastData[1]}
          {#if stop[0] === stop[1]}
            <li class="joint">
              <div class="icon" tabindex="0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
              </div>
              <div class="display">{stop[0]}</div>
            </li>
          {:else}
            {#if stop[0] === lastData[0]}
              {#if stop[2] === 1}
                <li class="blank carrying"> </li>
                <li class="opponent">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[1]}</div>
                </li>
              {:else if stop[2] === 2}
                <li class="blank me"> </li>
                <li class="opponent carrying">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[1]}</div>
                </li>
              {:else if stop[2] === 3}
                <li class="blank carrying"> </li>
                <li class="carrying">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[1]}</div>
                </li>
              {:else}
                <li class="blank me"> </li>
                <li class="opponent">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[1]}</div>
                </li>
              {/if}
            {:else if stop[1] === lastData[1]}
              {#if stop[2] === 1}
                <li class="me carrying">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[0]}</div>
                </li>
                <li class="blank opponent"> </li>
              {:else if stop[2] === 2}
                <li class="me">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[0]}</div>
                </li>
                <li class="blank carrying"> </li>
              {:else if stop[2] === 3}
                <li class="carrying">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[0]}</div>
                </li>
                <li class="blank carrying"> </li>
              {:else}
                <li class="me">
                  <div class="icon" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                  </div>
                  <div class="display">{stop[0]}</div>
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
    padding: 1rem;
    color: #000;
    background: var(--wiki-chrome-bg-color);
    display: grid;
    grid-template-columns: 1fr 1fr;
    list-style-type: none;
    text-align: center;
    overflow-y: scroll;

    position: fixed;
    top: 20px;
    left: 20px;
    width: 300px;
    height: auto;
  }

  li {
    min-height: 1rem;
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
    z-index: 0;
  }

  li:nth-child(1)::before, li:nth-child(2)::before {
    height: 50%;
    top: 50%;
  }
  li:last-child::before, li:nth-last-child(2)::before {
    height: 50%;
    top: 0;
  }

  li.me {
    --accent: var(--red-hsl);
    --accent-2: var(--red-dark-15);
  }
  li.opponent {
    --accent: var(--blue-hsl);
    --accent-2: var(--blue-dark-15);
  }

  li.joint {
    grid-column: 1 / span 2;
    --accent: #d5d7da;
    --accent-2: #b9bbbe;
  }
  li.joint::before {
    width: calc(50% - 6px);
    height: 10px;
    border: none;
    border-top: solid 2px var(--accent-2);
    border-bottom: solid 2px var(--accent-2);
    top: 50%;
    transform: translate(-50%, -50%);
  }
  li.joint::after {
    content: '';
    width: calc(50% + 10px);
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, var(--accent-2) 0px 2px, var(--accent) 2px 8px, var(--accent-2) 8px 10px, transparent 10px calc(100% - 10px), var(--accent-2) calc(100% - 10px) calc(100% - 8px), var(--accent) calc(100% - 8px) calc(100% - 2px), var(--accent-2) calc(100% - 2px) 100%);
    z-index: -1;
  }

  li div.icon {
    width: 1.5rem;
    height: 1.5rem;
    color: rgba(0, 0, 0, 50%);
    background: #fff;
    border: solid 1px rgba(0, 0, 0, 75%);
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 50%);
    display: grid;
    place-items: center;
    position: relative;
    z-index: 1;
  }
  div.icon svg {
    width: 1em;
    height: 1em;
    font-size: 0.9rem;
    fill: currentColor;
  }

  div.icon:hover + div.display {
    display: grid;
  }
  div.icon:focus + div.display {
    display: grid;
    outline: solid 2px yellow;
  }

  div.display {
    min-width: max-content;
    padding: 0.3rem 0.8rem;
    border-radius: 3px;
    color: black;
    background: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 30%);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    place-items: center;
    text-align: center;
    z-index: 2;
  }
  div.display:hover {
    display: grid;
  }

  .carrying {
    --accent: yellow;
    --accent-2: #dddd00;
  }
</style>