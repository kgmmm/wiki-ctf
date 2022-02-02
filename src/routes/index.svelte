<script>
  import SignInOut from "$lib/components/SignInOut.svelte";
</script>

<article>
  <h1>Wikipedia Capture the Flag!</h1>
  <img src="/img/flag-globe.svg" alt="Flag Globe Logo" class="flag-globe">
</article>
<aside>
  <SignInOut />
</aside>

<style>
  img.flag-globe {
    width: 15rem;
    height: 15rem;
    opacity: 20%;
  }

  article {
    background: blue; /* TODO stuff here*/
  }

  aside {
    grid-area: aside;
    display: grid;
    grid-template-rows: 1fr 100px;
    grid-template-areas:
      "content"
      "user";
    background: var(--red);
  }
</style>