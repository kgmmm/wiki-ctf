<script>
  import { initializeApp } from 'firebase/app';
  import { getAuth, onAuthStateChanged } from "firebase/auth";

  import { authStore } from "$lib/stores/authStore";

  import { onMount } from "svelte";

  onMount(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyAjb-7gahAHo5p78WEMjRKZ76ycBFkUG9k",
      authDomain: "wiki-ctf.firebaseapp.com",
      projectId: "wiki-ctf",
      storageBucket: "wiki-ctf.appspot.com",
      messagingSenderId: "484694334736",
      appId: "1:484694334736:web:37045f1608595c26c15995",
      measurementId: "G-WZNKJEST70"
    };

    const app = initializeApp(firebaseConfig);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        authStore.set({
          isLoggedIn: true,
          userID: uid,
        });
      } else {
        authStore.set({
          isLoggedIn: false,
          userID: undefined,
        });
      }
    });
  });
</script>

<main>
  <slot/>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 400px;
    grid-template-rows: 100%;
    overflow: hidden;
  }
</style>