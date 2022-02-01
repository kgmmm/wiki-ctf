<script>
  import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

  import { authStore } from "$lib/stores/authStore";

  async function logInWithGoogle() {
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

<article>
  <h1>Wikipedia Capture the Flag!</h1>
  <img src="/img/flag-globe.svg" alt="Flag Globe Logo" class="flag-globe">
</article>
<aside>
  <h2>Aside</h2>
  {#if !$authStore.isLoggedIn}
    <button class="login" on:click={logInWithGoogle}>log in</button>
  {:else}
    <button on:click={signOut}>sign out</button>
  {/if}
</aside>

<style>
  article {
    background: var(--red);
  }
  aside {
    background: var(--blue);
  }
  img.flag-globe {
    width: 15rem;
    height: 15rem;
    opacity: 20%;
  }
  button.login {
    color: transparent;
    width: 382px;
    height: 92px;
    border: none;
    background: url("/img/btn_google_signin_dark_normal_web@2x.png");
    cursor: pointer;
  }
  button.login:active {
    background: url("/img/btn_google_signin_dark_pressed_web@2x.png");
  }
</style>