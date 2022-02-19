<script>
  export let size;
  export let color;
</script>

<div style="width: {size}px; height: {size}px; --b: {size / 8}px; border-top-color: {color};"></div>

<style>
  div {
    place-self: center;
    border: solid var(--b) rgba(0, 0, 0, 40%);
    border-top-color: var(--red);
    border-radius: 50%;
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    to { transform: rotate(360deg); }
  }
</style>