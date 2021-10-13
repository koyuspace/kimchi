<template>
  <Navbar v-if="store.user" />
  <Auth v-if="!store.user" />
  <Profile v-if="store.user && store.page === 'profile'" />
  <Home v-if="store.user && store.page === 'home'" />
  <Firewall v-if="store.user && store.page === 'firewall'" />
  <Footer v-if="store.user" />
</template>

<script>
import { store } from "./store"
import { supabase } from "./supabase"
import Auth from "./components/Auth.vue"
import Profile from "./components/Profile.vue"
import Home from "./components/Home.vue"
import Navbar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue"
import Firewall from "./components/Firewall.vue"

export default {
  components: {
    Auth,
    Profile,
    Home,
    Navbar,
    Footer,
    Firewall,
  },

  setup() {
    store.user = supabase.auth.user()
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    return {
      store,
    }
  },
}
</script>
