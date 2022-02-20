<script>
  import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { authStore } from "$lib/stores/authStore";

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user); // LOG
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage); // LOG
      });
    }
    async function signOut() {
      const auth = getAuth();
      await auth.signOut();
      console.log("signed out");
    }
</script>

<div class="user">
  {#if $authStore.isLoggedIn}
    <div class="profilepic">
      <img src={$authStore.profilePic} alt="Your pretty face" class="profilepic" referrerpolicy="no-referrer">
    </div>
    <div class="loggedInAs">
      <h4>Logged in as:</h4>
      <span>{$authStore.displayName}</span>
    </div>
    <button class="signout" title="Sign out" on:click={signOut}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z"
          fill="currentColor"
        />
        <path
          d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z"
          fill="currentColor"
        />
      </svg>
    </button>
  {:else if !$authStore.isLoggedIn}
    <button class="signin" on:click={signInWithGoogle}>sign in with google</button>
  {/if}
</div>

<style>
  button.signin {
    grid-area: text;
    color: transparent;
    width: 191px;
    height: 46px;
    border: none;
    background: url("/img/btn_google_signin_dark_normal_web@2x.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    place-self: center;
  }
  button.signin:focus {
    outline: solid 2px yellow;
  }
  button.signin:focus:not(:focus-visible) {
    outline: none;
  }
  button.signin:focus-visible {
    outline: solid 2px yellow;
  }
  
  div.user {
    grid-area: user;
    background: rgba(0, 0, 0, 20%);
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    grid-template-areas: "profilepic text signout";
    place-items: center;
  }

  div.profilepic {
    grid-area: profilepic;
    width: 70px;
    height: 70px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    border: solid 2px #fff;
  }
  div.profilepic img.profilepic {
    width: 100%;
  }

  div.loggedInAs {
    width: 100%;
    display: grid;
    align-content: center;
  }
  div.loggedInAs h4 {
    font-size: 0.875rem;
    font-weight: normal;
    opacity: 50%;
  }
  div.loggedInAs span {
    font-size: 1rem;
  }

  button.signout {
    grid-area: signout;
    width: 40px;
    height: 40px;
    aspect-ratio: 1 / 1;
    border: none;
    border-radius: 10px;
    color: #fff;
    background: rgba(255, 255, 255, 10%);
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  button.signout:hover {
    background: rgba(255, 255, 255, 15%);
  }
  button.signout:focus {
    background: rgba(255, 255, 255, 15%);
    outline: solid 2px yellow;
  }
  button.signout:focus:not(:focus-visible) {
    outline: none;
  }
  button.signout:focus-visible {
    outline: solid 2px yellow;
  }

  button.signout svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    font-size: 1.4rem;
  }
</style>