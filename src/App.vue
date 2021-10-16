<template>
  <Navbar v-if="store.user" />
  <Auth v-if="!store.user" />
  <Profile v-if="store.user && store.page === 'profile'" />
  <Home v-if="store.user && store.page === 'home'" />
  <Firewall v-if="store.user && store.page === 'firewall'" />
  <Services v-if="store.user && store.page === 'services'" />
  <Deploy v-if="store.user && store.page === 'deploy'" />
  <Console v-if="store.user && store.page === 'console'" />
  <About v-if="store.user && store.page === 'about'" />
  <Footer v-if="store.user" />
</template>

<script>
import { store } from "./store"
import { supabase } from "./supabase"
import { loadServices, findParameter } from "./globalfunc"
import Auth from "./components/Auth.vue"
import Profile from "./components/Profile.vue"
import Home from "./components/Home.vue"
import Navbar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue"
import Firewall from "./components/Firewall.vue"
import Services from "./components/Services.vue"
import Deploy from "./components/Deploy.vue"
import Console from "./components/Console.vue"
import About from "./components/About.vue"

export default {
  components: {
    Auth,
    Profile,
    Home,
    Navbar,
    Footer,
    Firewall,
    Services,
    Deploy,
    Console,
    About,
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
  mounted() {
    window.setInterval(function() {
      if (findParameter("page")) {
          store.page = findParameter("page")
          loadServices()
          var myUrl = new URL(window.location.href.replace(/#/g,"?"))
          myUrl.searchParams.delete("page")
          myUrl = myUrl.href.replace("?","#")
          location.href = myUrl
      }
    }, 20)
  }
}
</script>
