<script>
  export let userID;
  export let displayName;
  export let profilePic;
</script>

<div class="user">
  <button class="disconnect" title="Disconnect" on:click>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
        fill="currentColor"
      />
    </svg>
  </button>
  <div class="opponentIs">
    <h4>Opponent:</h4>
    <span class="char-limit">{displayName}</span>
  </div>
  <div class="profilepic">
    <img src={profilePic} alt={`${userID}'s profile picture`} class="profilepic" referrerpolicy="no-referrer">
  </div>
</div>

<style>
  div.user {
    grid-area: opponent;
    background: var(--blue-light-5);
    border-bottom: solid 1px var(--blue-dark-5);
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    grid-template-areas: "disconnect text profilepic";
    place-items: center;
  }

  div.profilepic {
    grid-area: profilepic;
    width: 65px;
    height: 65px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    border: solid 2px var(--blue-dark-5);
  }
  div.profilepic img.profilepic {
    width: 100%;
  }

  div.opponentIs {
    width: 100%;
    display: grid;
    align-content: center;
    text-align: right;
  }
  div.opponentIs h4 {
    font-size: 0.875rem;
    font-weight: normal;
    opacity: 50%;
    line-height: 1;
  }
  div.opponentIs span {
    font-size: 1rem;
    line-height: 1;
    max-width: 200px;
  }

  button.disconnect {
    grid-area: disconnect;
    width: 40px;
    height: 40px;
    aspect-ratio: 1 / 1;
    border: none;
    border-radius: 10px;
    color: #fff;
    background: transparent;
    border: solid 1px var(--blue-dark-5);
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  button.disconnect:hover {
    background: rgba(255, 255, 255, 10%);
  }

  button.disconnect svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    font-size: 1.4rem;
  }
</style>