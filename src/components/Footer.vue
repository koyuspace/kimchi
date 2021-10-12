<template>
<div class="container">
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 bg-dark fixed-bottom">
    <p class="col-md-4 mb-0 text-muted">&copy; 2021 The Kimchi Project</p>

    <a href="/" class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
    </a>

    <p class="nav col-md-4 text-muted px-2 justify-content-end">User ID: <a href="#" style="text-decoration:none;margin-left:4px;" @click.prevent="isRevealed=!isRevealed"><span class="text-muted" v-if="isRevealed">{{ user.id }}</span><span class="text-muted" v-else>Reveal</span></a></p>
  </footer>
</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
.logo {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 16pt;
  user-select: none;
  margin-right: 20px;
  vertical-align: top;
}
footer {
  padding: 10px;
}
</style>

<script>
import { store } from "../store"

export default {
  data: function() {
    return {
      isRevealed: false
    }
  },
  computed: {
    user: {
        get() {
            if (store.user) {
                return store.user;
            } else {
                return {};
            }
        }
    }
  }
}
</script>
