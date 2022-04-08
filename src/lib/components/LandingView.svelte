<script>
  import { fly, fade } from "svelte/transition";
</script>

<article>
  <div class="col-1" in:fly={{ x: -100, duration: 400 }} out:fly={{ x: -500, duration: 200 }}>
    <h1 in:fly={{ x: -50, duration: 300, delay: 200}}>capture the flag<img src="/img/Wikipedia_wordmark.svg" alt="Wikipedia wordmark"></h1>
  </div>
  <div class="col-2">
    <div class="content" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 150 }}>
      <h2>Wikipedia Capture the Flag</h2>
      <span class="link">For more about this project, see the <a href="https://github.com/kgmmm/wiki-ctf" target="_blank">Github repo</a></span>
      <p>Sign in and invite a friend to play a head-to-head game of Wikipedia Capture the Flag! Plant a flag on a Wikipedia page of your choosing. Race through Wikipedia links to capture your opponents flag.<sup><a href="#tip-1" rel=external>[1]</a></sup> Hurry back to base with their flag to score a point, and let the next round begin.<sup><a href="#tip-2" rel=external>[2]</a></sup> Watch out for interceptions! If a flag carrier is intercepted, any flags will sent back to base.</p>
      <h3>Tips</h3>
      <ol>
        <li id="tip-1">A lot of links have been disabled to keep you on track.</li>
        <li id="tip-2">The back button isn't going to help you get back to base.</li>
      </ol>
      <div class="disclaimer">
        <p>Wikipedia is a registered trademark of Wikimedia Foundation inc. This project is not associated with or provided by Wikimedia Foundation inc.</p>
      </div>
    </div>
  </div>
</article>

<style>
  article {
    grid-area: article;
    display: grid;
    grid-template-columns: 1fr 760px;
    z-index: -1;
  }

  div.col-1 {
    background: var(--red-hsl);
    display: grid;
    align-items: center;
    justify-items: right;
    text-align: right;
    box-shadow: 0 0 5px rgba(0, 0, 0, 50%);
  }

  div.col-1 h1 {
    margin: 1rem;
    max-width: min-content;
    font-size: 5rem;
    color: #fff;
    line-height: 90%;
    text-transform: uppercase;
    position: relative;
  }
  div.col-1 h1 img {
    height: 30px;
    position: absolute;
    right: 0;
    top: -30px;
  }

  div.col-2 {
    display: grid;
    place-items: center;
  }

  div.content {
    margin: 1.5rem;
    padding: 1.5rem 2rem;
    font-size: 1rem;
    line-height: 150%;
    color: #222222;
    background: white;
    border-radius: 3px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
    position: relative;
  }

  div.content a {
    color: #0645ad;
    text-decoration: none;
  }
  div.content a:hover {
    text-decoration: underline;
  }
  div.content a:active {
    color: #faa700;
  }
  div.content sup {
    font-size: 70%;
    line-height: 1;
  }
  div.content p {
    line-height: 1.6;
  }
  div.content h2, div.content h3 {
    font-family: "Linux Libertine", "Georgia", "Times", serif;
    font-size: 1.8rem;
    line-height: 1.3;
    margin-bottom: 0.25rem;
    font-weight: normal;
    border-bottom: 1px solid #a2a9b1;
  }
  div.content h3 {
    margin-top: 1rem;
    font-size: 1.5rem;
  }
  div.content span.link {
    display: block;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    padding-left: 1.6em;
    font-style: italic;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  div.content ol {
    margin: 0.3rem 0 0.5rem 3rem;
    font-size: 0.85rem;
  }
  div.content ol li:target {
    outline: solid 2px #3366cc;
    border-radius: 3px;
  }

  div.disclaimer {
    position: absolute;
    left: 0;
    top: 100%;
    color: #555a5f;
  }

  div.disclaimer p {
    padding: 0.75rem 1rem;
    font-size: 0.7rem;
    font-style: italic;
  }

  @media screen and (max-width: 1560px) {
    div.col-1 h1 {
      display: none;
    }
  }

  @media screen and (max-width: 1160px) {
    article {
      grid-template-columns: Clamp(500px, 100%, 100%);
    }

    div.col-1 {
      display: none;
    }
  }
</style>